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

var botaoExibir = getById('botaoExibir');
botaoExibir.addEventListener('click', exibirConteudo);

function exibirConteudo() {
    let texto = getById('caixaDeTexto').value.trim();

    if(texto === '') {
        exibirErro('O campo não pode estar vazio!', 'mensagemErro');
        return;
    }
    getById('conteudo').innerHTML = texto;
}
