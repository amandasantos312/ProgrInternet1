function getById(id) {
    return document.getElementById(id);
}

getById('btnAdicionar').addEventListener('click', () => {
    let input = getById('inputHashtag');
    let select = getById('hashtagList');
    let mensagemErro = getById('mensagemErro');

    let hashtag = input.value.trim();

    mensagemErro.innerText = '';

    if (hashtag === '') {
        mensagemErro.innerText = 'Digite uma hashtag válida!';
        return;
    }

    // Verifica se a hashtag tem ao menos 2 caracteres além do '#'
    if (hashtag.length < 3) {
        mensagemErro.innerText = 'Hashtag deve ter pelo menos 2 caracteres!';
        return;
    }

    // Verifica se já existem 5 hashtags
    if (select.options.length >= 5) {
        mensagemErro.innerText = 'Você só pode adicionar até 5 hashtags!';
        return;
    }

    // Adiciona '#' se não tiver
    if (!hashtag.startsWith('#')) {
        hashtag = '#' + hashtag;
    }

    // Verifica se a hashtag já existe na lista
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value.toLowerCase() === hashtag.toLowerCase()) {
            mensagemErro.innerText = 'Hashtag já adicionada!';
            return;
        }
    }

    // Cria a option e adiciona ao select
    const option = document.createElement('option');
    option.value = hashtag;
    option.innerText = hashtag;
    select.appendChild(option);

    // Limpa o campo
    input.value = '';
});

getById('btnRemover').addEventListener('click', () => {
    let select = getById('hashtagList');
    let mensagemErro = getById('mensagemErro');

    mensagemErro.innerText = '';

    // Verifica se há alguma hashtag selecionada
    if (select.selectedOptions.length === 0) {
        mensagemErro.innerText = 'Selecione uma hashtag para remover!';
        return;
    }

    // Remove a opção selecionada
    for (let i = 0; i < select.selectedOptions.length; i++) {
        select.removeChild(select.selectedOptions[i]);
    }
});