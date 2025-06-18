function getById(id) {
    return document.getElementById(id);
}

function moverSelecionados(origem, destino) {
    let selecionados = Array.from(origem.selectedOptions);

    if (selecionados.length === 0) {
        alert("Selecione pelo menos um item para mover.");
        return;
    }

    selecionados.forEach(opcao => {
        // Remove da origem
        origem.removeChild(opcao);
        // Adiciona ao destino
        destino.appendChild(opcao);
    });
    atualizarBotoes();
}

function atualizarBotoes() {
    const ativosDisponiveis = getById('ativosDisponiveis');
    const carteiraInvestimentos = getById('carteiraInvestimentos');
    const btnDireita = getById('moverParaDireitaBtn');
    const btnEsquerda = getById('moverParaEsquerdaBtn');

    btnDireita.disabled = ativosDisponiveis.options.length === 0;
    btnEsquerda.disabled = carteiraInvestimentos.options.length === 0;
}

document.addEventListener('DOMContentLoaded', () => {
    const ativosDisponiveis = getById('ativosDisponiveis');
    const carteiraInvestimentos = getById('carteiraInvestimentos');
    const btnDireita = getById('moverParaDireitaBtn');
    const btnEsquerda = getById('moverParaEsquerdaBtn');

    btnDireita.addEventListener('click', () => {
        moverSelecionados(ativosDisponiveis, carteiraInvestimentos);
    });

    btnEsquerda.addEventListener('click', () => {
        moverSelecionados(carteiraInvestimentos, ativosDisponiveis);
    });
});    