function getById(idElemento) {
    return document.getElementById(idElemento)
}

getById('botaoCarregarImagem').addEventListener('click', () => {
    let input = getById('uploadImage');
    let resultado = getById('resultado');

    resultado.innerHTML = '';

    const arquivoSelecionado = input.files[0];

    if (!arquivoSelecionado) {
        resultado.innerText = 'Nenhuma imagem selecionada!';
        return;
    }

    const img = document.createElement('img');
    img.src = URL.createObjectURL(arquivoSelecionado);
    img.alt = 'Imagem carregada';
    img.style.maxWidth = '300px';
    img.style.marginTop = '10px';

    resultado.appendChild(img);
});