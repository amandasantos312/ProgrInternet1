const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const pastaPaginas = './dados/paginas';
const arquivoVisitados = './dados/visitados.json';

function carregarPaginasSalvas() {
    const urls = JSON.parse(fs.readFileSync(arquivoVisitados, 'utf-8'));
    const paginas = [];

    for (const url of urls) {
        const caminho = path.join(pastaPaginas, encodeURIComponent(url) + '.html');
        if (fs.existsSync(caminho)) {
            const html = fs.readFileSync(caminho, 'utf-8');
            paginas.push({ url, html });
        }
    }

    return paginas;
}

function calcularAutoridade(paginas) {
    const dados = {};

    for (const { url: origem, html } of paginas) {
        const $ = cheerio.load(html);

        $('a').each((_, el) => {
            let destino = $(el).attr('href');
            try {
                destino = new URL(destino, origem).href;

                if (!dados[destino]) {
                    dados[destino] = { linksRecebidos: 0, autoreferencia: false };
                }

                if (destino === origem) {
                    dados[destino].autoreferencia = true;
                } else {
                    dados[destino].linksRecebidos += 1;
                }

            } catch (_) {
                // link inválido
            }
        });
    }

    return dados;
}

function buscar(termo) {
    const paginas = carregarPaginasSalvas();
    const autoridade = calcularAutoridade(paginas);
    const termoMin = termo.toLowerCase();
    const regex = new RegExp(`\\b${termoMin}\\b`, 'g');

    const resultados = [];

    for (const { url, html } of paginas) {
        const $ = cheerio.load(html);

        // Extrai texto apenas de tags relevantes
        const textoRelevante = [
            $('title').text(),
            $('h1').text(),
            $('h2').text(),
            $('p').text(),
            $('a').text()
        ].join(' ').toLowerCase();

        const ocorrencias = (textoRelevante.match(regex) || []).length;

        if (ocorrencias === 0) continue;

        const pontosTermo = ocorrencias * 5;
        const dados = autoridade[url] || { linksRecebidos: 0, autoreferencia: false };
        const pontosAutoridade = dados.linksRecebidos * 10;
        const penalidade = dados.autoreferencia ? -15 : 0;

        const pontuacaoFinal = pontosTermo + pontosAutoridade + penalidade;

        resultados.push({
            url,
            ocorrencias,
            linksRecebidos: dados.linksRecebidos,
            autoreferencia: dados.autoreferencia,
            pontuacaoFinal
        });
    }

    resultados.sort((a, b) => {
        if (b.pontuacaoFinal !== a.pontuacaoFinal) return b.pontuacaoFinal - a.pontuacaoFinal;
        if (b.linksRecebidos !== a.linksRecebidos) return b.linksRecebidos - a.linksRecebidos;
        if (b.ocorrencias !== a.ocorrencias) return b.ocorrencias - a.ocorrencias;
        return (a.autoreferencia === b.autoreferencia) ? 0 : (a.autoreferencia ? 1 : -1);
    });

    return resultados;
}


// 🔍 Exemplo de uso
const termo = 'Matrix';
const resultados = buscar(termo);

console.log(`\nResultados para o termo: "${termo}"`);
for (const r of resultados) {
    console.log(`📄 ${r.url}`);
    console.log(`   ➤ Ocorrências: ${r.ocorrencias}, Links recebidos: ${r.linksRecebidos}, Autorreferência: ${r.autoreferencia ? 'Sim' : 'Não'}, Pontuação: ${r.pontuacaoFinal}\n`);
}