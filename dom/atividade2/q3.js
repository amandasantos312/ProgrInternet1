function getById(idElemento) {
    return document.getElementById(idElemento)
}

function exibirErro(mensagem, idElemento) {
    let elementoErro = getById(idElemento);

    if (!elementoErro) {
        console.error(`Elemento com id ${idElemento} não encontrado.`);
        return;
    }

    elementoErro.innerText = mensagem;
    elementoErro.classList.remove('oculto');

    setTimeout(() => {
        elementoErro.classList.add('oculto');
    }, 3000);
}

getById('botaoCalcularTaxa').addEventListener('click', () => {
    const interacoes = parseFloat(getById('numInteracoes').value.trim());
    const visualizacoes = parseFloat(getById('numVisualizacoes').value.trim());

    if (isNaN(interacoes) || isNaN(visualizacoes)) {
        exibirErro('Preencha todos os campos com valores numéricos!', 'mensagemErro');
        return;
    }

    if (visualizacoes === 0) {
        exibirErro('O número de visualizações deve ser maior que zero.', 'mensagemErro');
        return;
    }

    const taxa = (interacoes / visualizacoes) * 100;
    const resultado = getById('resultado');
    resultado.innerText = `Taxa de Engajamento: ${taxa.toFixed(2)}%`;

    // limpa os campos após calcular
    getById('numInteracoes').value = '';
    getById('numVisualizacoes').value = '';
});

function exibirConteudo() {
    let texto = getById('caixaDeTexto').value.trim();

    if(texto === '') {
        exibirErro('O campo não pode estar vazio!', 'mensagemErro');
        return;
    }
    getById('conteudo').innerHTML = texto;
}