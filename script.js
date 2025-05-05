function getById(id) {
    return document.getElementById(id);
}

//Tag h1
let h1 = document.getById('principal');
h1.innerText = "Aprendendo D.O.M";
console.log(h1);
console.log(typeof(h1));

//Tag div
let divResultado1 = document.getById('resultado1');
divResultado1.innerText = "Escrevendo dentro da div";

//Tag p
let divPai = document.getById('pai');
let paragrafosFilhos = divPai.children;

let divResultadoFilhos = document.getById('resultadoFilhos')
for (var i = 0; i < paragrafosFilhos.length; i++){
    divResultadoFilhos.innerHTML +=
        paragrafosFilhos[i].innerText + '<br>';
}

//Tag button
let botao1 = document.getById('botao1');
botao1.addEventListener('click', () => {
    alert('clicou no botão');
});

/*let botao1 = document.getById('botao1');
botao1.addEventListener('click', cliqueBotao1);

function cliqueBotao1() {
    alert('clicou no botão');
}*/

//Tag label/input/button
let botaoSomar = document.getById('botaoSomar')
botaoSomar.addEventListener('click', somar);

function somar() {
    let textoNumero1 = document.getById('numero1')
    let textoNumero2 = document.getById('numero2')

    let soma = Number(textoNumero1.value) + Number(textoNumero2.value);

    let resultadoSoma = document.getById('resultadoSoma');
    resultadoSoma.innerText = soma;
}
