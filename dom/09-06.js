function getById(id){
    return document.getElementById(id);
}

let botaoCriarParagrafo = getById('botaoCriarParagrafo');

botaoCriarParagrafo.addEventListener('click', () => {
    let resultado1 = getById('resultado1');

    let p = document.createElement('p');
    //p.id = "meuParagrafo";
    p.setAttribute('id', 'meuParagrafo');
    p.innerText = "Hello World";
    
    resultado1.appendChild(p);
});

let botaoCriarElementos = getById('botaoCriarElementos');

botaoCriarElementos.addEventListener('click', () => {
    let elemento = getById('elemento').value;
    let textoElemento = getById('textoElemento').value;
    let idElemento = getById('idElemento').value;
    let parentElemento = getById(getById('parentElemento').value);

    let elementoCriado = document.createElement(elemento);
    elementoCriado.innerText = textoElemento;
    elementoCriado.id = idElemento;
    parentElemento.appendChild(elementoCriado)
})

let contador = 1;
let botaoAddTask = getById('botaoAddTask');
botaoAddTask.addEventListener('click', () => {
    let task = getById('task').value;
    let percentualExecucao = getById('percentualExecucao').value;
    let tabelaTasks = getById('tabelaTasks');

    let tr = document.createElement('tr');
    tr.id = contador;

    let tdContador = document.createElement('td');
    tdContador.innerText = contador;

    let tdTesk = document.createElement('td');
    tdTesk.innerText = task;

    let tdPercentualExecucao = document.createElement('td');
    tdPercentualExecucao.innerText = percentualExecucao + '%';

    tr.appendChild(tdContador);
    tr.appendChild(tdTesk);
    tr.appendChild(tdPercentualExecucao);

    tabelaTasks.appendChild(tr);
    contador++

})    