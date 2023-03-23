const timestamp = (new Date()).getTime()
const publicKey = 'c7166cd7fb5a9b9db8da09282cfa7cc3'
const privateKey = '81611f6e95916b995d81c2ede7931cf84e6e951e'
const hash = timestamp + privateKey + publicKey
const hashMd5 = MD5.generate(hash)

//variavel que ira conter os dados
let dados

//pegando elementos do HTML
const section = document.querySelector("section")
const bgModal = document.querySelector('.bg-modal')
//criando variaveis para salvar dados que serão injetados no html
let containers = ''
let modal = ''


//chamando a api
const promise = fetch(`https://gateway.marvel.com:443/v1/public/characters?apikey=${publicKey}&ts=${timestamp}&hash=${hashMd5}`)
//recebendo respota da api
promise.then(respostaDoServidor => {
    //tratando a resposa da api
    respostaDoServidor.json().then(respostaTratada => {
        dados = respostaTratada.data.results
        dados.map(item => (imprimirPersonagem(item)))
        console.log(dados)
 
    })
}, error => {
    console.log('Erro: ' + error)
});


//função que abre o modal, verifica o ID chamado e retorna os dados.
function abrirModal(id){

    //troclando classes para abrir o modal
    bgModal.classList.remove('d-none')
    bgModal.classList.add('d-flex')

    //variavel que contera os dados de um unico personagem
    let personagem = ''

    //for para comparar comparar id do botão com o de cada personagem.
    for(let i = 0 ; i < dados.length ; i++){
        const idDoPersonagem = dados[i].id
        if(idDoPersonagem == id){
            //salvando os dados do personagem que contem o id expecificado na variavel.
            personagem = dados[i]
            //parando a repetição.
            i = dados.length
        }
    }

    //salvando nome do personagem
    let nome = personagem.name
    //criando o codigo HTML com os dados do personagem selecionado.
    modal =  `
    <div  class="modal">
    <button class="fechar" onClick="fecharModal()" >X</button>
    <h2>${nome}</h2>
    <div class="modal-info">
        <div>
            <h3>Comics</h3>
            ${imprimirComics(personagem)}
        </div>
        <div>
            <h3>Stories</h3>
            ${imprimirStories(personagem)}
        </div>
    </div>
    </div>
    `
    //injetando o codigo criando no documento HTML
    bgModal.innerHTML = modal

}

//função para imprimir todas as comics do personagem selecionado.
function imprimirComics(personagem){
    //salvando array de quadrinhos na variavel comics
    const comics = personagem.comics.items
    //criando variavel que ira conter string com todas os quadrinhos
    let saida = ''
    //for each para concatenar todos os quadrinhos em uma unica string
    comics.forEach((comic) => saida = saida + `<p>${comic.name}</p>`)

    //retornado a string.
    return saida
}

//função para imprimir todas as historias do personagem
function imprimirStories(personagem){
    //salvando array de historias na variavel stories
    const stories = personagem.stories.items
    //criando variavel que ira conter string com todas as historias
    let saida = ''
    //for each para concatenar todos as historias em uma unica string
    stories.forEach((storie) => saida = saida + `<p>${storie.name}</p>`)

    //retornado a string.
    return saida
}

//função para fechar o modal
function fecharModal(){
    //removendo classe que aplica display flex, e adicionando classe que aplica display none
    bgModal.classList.remove('d-flex')
    bgModal.classList.add('d-none')
}

//função para criar conteudo da pagina principal com os conteudos da API
function imprimirPersonagem(item){
    //criando variaveis para armazenar dados que vou usar
    const nome = item.name
    const img = item.thumbnail.path + "." + item.thumbnail.extension
    const id = item.id

    //criando codigo HTML que sera injetado na pagina
    containers = containers + `
    <div class="container">
    <img src="${img}" alt="">
    <h2>${nome}</h2>
    <button onclick="abrirModal(${id})">Detalhe</button>
    </div>
    `
    //injetando codigo na pagina
    section.innerHTML = containers
    
}

//função que remove giff de loading ao carregar a pagina
function loading(){
    let img = document.querySelector('.loading')
    setTimeout(()=> {
        img.classList.add('d-none')
    }, 1000)
    
}