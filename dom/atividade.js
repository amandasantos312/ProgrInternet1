function getById(id) {
  return document.getElementById(id);
}

function getByNameTag(nameTag) {
  return document.getElementsByTagName(nameTag)
}

//2.a)getById:
let turnos = getById("turnos");

turnos.addEventListener("change", () => {
  let turno = turnos.value;
  let resultadoTurno = getById("resultadoTurno");

  resultadoTurno.innerText = "Turno selecionado: " + turno;
});

let nome = getById("nome");
nome.innerText = "Amanda";

//2.b)getElementByTagName():
let tag = getByNameTag("select");
console.log(tag)

//3.Crie um código que conte o número de parágrafos dentro de uma div e exiba oresultado em uma outra div.
const divConteudo = getById('conteudo');

const paragrafos = divConteudo.getElementsByTagName('p');
const numParagrafos = paragrafos.length;

const divResultado = getById('resultado');
divResultado.textContent = `Numero de paragrafos: ${numParagrafos}`;

//4. 
var botao = getById('botao');

botao.addEventListener("click", function() {
  var paragrafo = getById('paragrafo');

  paragrafo.textContent = "O texto deste parágrafo foi alterado!";
});

//Crie um segundo botão “limpar” que limpe o conteúdo do texto do parágrafo.
var limpar = getById('limpar')

limpar.addEventListener("click", function() {
  var paragrafo = getById('paragrafo');

  paragrafo.textContent = "";
});

//6.
getById("p2").style.color = "red";

//7.
function copiarTexto() {
  const entrada = getById('entrada');
  const saida = getById('saida');

  saida.value = entrada.value.toUpperCase();
}

//8.
function ativarAltoContraste() {
  document.body.classList.add('alto-contraste');
}

function resetarCores() {
  document.body.classList.remove('alto-contraste');
}

//9.
const tamanhoMin = 10;
const tamanhoMax = 40;

function ajustarTexto(delta) {
  const body = document.body;

  // Pega o tamanho atual da fonte em pixels
  let style = window.getComputedStyle(body).fontSize;
  let tamanhoAtual = parseFloat(style);

  // Calcula o novo tamanho
  let novoTamanho = tamanhoAtual + delta;

  // Limita o tamanho dentro do intervalo definido
  if (novoTamanho < tamanhoMin) novoTamanho = tamanhoMin;
  if (novoTamanho > tamanhoMax) novoTamanho = tamanhoMax;

  // Aplica o novo tamanho
  body.style.fontSize = novoTamanho + "px";
}

//10.
function calcular() {
  const n1 = parseFloat(getById('num1').value);
  const n2 = parseFloat(getById('num2').value);
  const resultadoDiv = getById('resultadoCalculadora');

  if (isNaN(n1) || isNaN(n2)) {
    resultadoDiv.textContent = "Por favor, insira dois números válidos.";
      return;
  }

  const radios = document.getElementsByName('operacao');
  let operacaoSelecionada = null;
  for (const radio of radios) {
    if (radio.checked) {
      operacaoSelecionada = radio.value;
        break;
    }
  }

  let resultado;
  if (operacaoSelecionada === 'somar') {
    resultado = n1 + n2;
  } else if (operacaoSelecionada === 'subtrair') {
    resultado = n1 - n2;
  } else if (operacaoSelecionada === 'multiplicar') {
    resultado = n1 * n2;
  } else if (operacaoSelecionada === 'dividir') {
    if (n2 === 0) {
      resultadoDiv.textContent = "Erro: divisão por zero não é permitida.";
      return;
    }
    resultado = n1 / n2;
  } else {
    resultadoDiv.textContent = "Selecione uma operação.";
    return;
  }
  resultadoDiv.textContent = `Resultado: ${resultado}`;
}

//11.
function adicionarItem() {
  const input = getById('itemTexto');
  const texto = input.value.trim();

  if (texto === '') return;

  const ul = getById('listaItens');
  const li = document.createElement('li');
  li.textContent = texto;

  ul.appendChild(li);

  input.value = "";
}

//12.
function adicionarOpcao() {
  const input = getById('textoSelect');          
  const texto = input.value.trim();              

  if (texto === "") return;                      

  const select = getById('listaSelect');         
  const option = document.createElement('option'); 
  option.text = texto;                           
  option.value = texto.toLowerCase();            

  select.appendChild(option);                    

  input.value = "";                  
}