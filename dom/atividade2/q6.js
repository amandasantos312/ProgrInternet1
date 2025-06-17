function getById(id) {
    return document.getElementById(id);
}

function getByName(name) {
    return document.getElementsByName(name)
}

getById('enviarBtn').addEventListener('click', () => {
    let checkboxes = getByName('redesSociais');
    let selecionadas = [];
    let mensagemErro = getById('mensagemErro');
    let resultado = getById('redesSelecionadas');

    mensagemErro.classList.add('oculto');
    mensagemErro.innerText = '';
    resultado.innerText = '';

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selecionadas.push(checkboxes[i].value);
        }
    }

    if (selecionadas.length === 0) {
        mensagemErro.classList.remove('oculto');
        mensagemErro.innerText = 'Selecione pelo menos uma rede social!';
    } else {
        resultado.innerText = 'Redes selecionadas: ' + selecionadas.join(', ');
    }
});