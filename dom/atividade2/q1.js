//Exemplo do pdf:
/*getById('botaoErro').addEventListener('click', function() {
    var errorMessage = getById('mensagemErro');
    errorMessage.classList.remove('oculto');
    setTimeout(function() {
        errorMessage.classList.add('oculto');
    }, 3000);
});*/

function getById(idElemento) {
    return document.getElementById(idElemento)
}

function exibirErro(mensagem, idElemento) {
    let elementoErro = getById(idElemento);

    if(!elementoErro) {
        console.error(`Elemento com id ${idElemento} não encontrado.`);
        return;
    }

    elementoErro.innerText = mensagem;
    elementoErro.classList.remove('oculto');

    setTimeout(function() {
        elementoErro.classList.add('oculto');
    }, 3000);
};

getById('botaoEnviar').addEventListener('click', () => {
    let nome = getById('campoNome').value.trim();
    let data = getById('campoData').value.trim();
    let email = getById('campoEmail').value.trim();
    let senha = getById('campoSenha').value.trim();

    if(!nome || !data || !email || !senha) {
        exibirErro('Preencha os campos obrigatórios!', 'mensagemErro');
        return
    } else {
        alert('Cadastro realizado com sucesso!');
    }
});