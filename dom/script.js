function getById(id) {
  return document.getElementById(id);
}

//Tag h1
let h1 = getById("principal");
h1.innerText = "Aprendendo D.O.M";
console.log(h1);
console.log(typeof h1);

//Tag div
let divResultado1 = getById("resultado1");
divResultado1.innerText = "Escrevendo dentro da div";

//Tag p
let divPai = getById("pai");
let paragrafosFilhos = divPai.children;

let divResultadoFilhos = getById("resultadoFilhos");
for (var i = 0; i < paragrafosFilhos.length; i++) {
  divResultadoFilhos.innerHTML += paragrafosFilhos[i].innerText + "<br>";
}

//Tag button
let botao1 = getById("botao1");
botao1.addEventListener("click", () => {
  alert("clicou no botão");
});

/*let botao1 = document.getById('botao1');
botao1.addEventListener('click', cliqueBotao1);

function cliqueBotao1() {
    alert('clicou no botão');
}*/

//Tag label/input/button
let botaoSomar = getById("botaoSomar");
botaoSomar.addEventListener("click", somar);

function somar() {
  let textoNumero1 = getById("numero1");
  let textoNumero2 = getById("numero2");

  let soma = Number(textoNumero1.value) + Number(textoNumero2.value);

  let resultadoSoma = getById("resultadoSoma");
  resultadoSoma.innerText = soma;
}

//Checkbox
let botaoInteresse = getById("botaoInteresse");

botaoInteresse.addEventListener("click", () => {
  let interesse = getById("interesse");
  let resultadoInteresse = getById("resultadoInteresse");

  let texto = "Voce não tem interesse nas novidades";
  if (interesse.checked) {
    texto = "Voce tem interesse nas novidades";
  }

  resultadoInteresse.innerText = texto;
});

//
let cidades = getById("cidades");

cidades.addEventListener("change", () => {
  let cidade = cidades.value;
  let resultadoCidade = getById("resultadoCidade");

  resultadoCidade.innerText = "Cidade selecionada: " + cidade;
});

let inputColor = getById("inputColor");

inputColor.addEventListener("change", () => {
  let cor = inputColor.value;
  document.body.style.backgroundColor = cor;
});