function getById(idElemento) {
    return document.getElementById(idElemento)
}

document.addEventListener('DOMContentLoaded', function () {
    let seletor = getById('seletorImagem');
    let botao = getById('botaoCarregarImagem');
    let imagem = getById('imagemSelecionada');

    botao.addEventListener('click', () => {
        const caminho = seletor.value;

        if (caminho) {
            imagem.src = caminho;
            imagem.style.display = 'block';
        } else {
            imagem.src = '';
            imagem.style.display = 'none';
            alert('Selecione uma imagem antes de carregar.');
        }
    });
});
