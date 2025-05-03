const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const pastaDados = './dados';
const pastaPaginas = path.join(pastaDados, 'paginas');
const arquivoVisitados = path.join(pastaDados, 'visitados.json');

// Garante que os diretórios existam
if (!fs.existsSync(pastaDados)) fs.mkdirSync(pastaDados);
if (!fs.existsSync(pastaPaginas)) fs.mkdirSync(pastaPaginas);
if (!fs.existsSync(arquivoVisitados)) fs.writeFileSync(arquivoVisitados, JSON.stringify([]));

let visitados = new Set(JSON.parse(fs.readFileSync(arquivoVisitados, 'utf-8')));

function salvarVisitado(url) {
    visitados.add(url);
    fs.writeFileSync(arquivoVisitados, JSON.stringify([...visitados], null, 2));
}

function salvarPagina(url, html) {
    const nomeArquivo = path.join(pastaPaginas, encodeURIComponent(url) + '.html');
    fs.writeFileSync(nomeArquivo, html);
}

async function crawler(url, profundidade = 0, limite = 10) {
    if (visitados.has(url) || profundidade > limite) return;

    console.log(`🔗 Visitando: ${url}`);
    salvarVisitado(url);

    try {
        const resposta = await axios.get(url);
        const html = resposta.data;
        salvarPagina(url, html);

        const $ = cheerio.load(html);
        const links = [];

        $('a').each((i, el) => {
            const href = $(el).attr('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                try {
                    const linkAbsoluto = new URL(href, url).href;
                    if (!visitados.has(linkAbsoluto)) {
                        links.push(linkAbsoluto);
                    }
                } catch (e) {
                    // Link malformado ignorado
                }
            }
        });

        for (const link of links) {
            await crawler(link, profundidade + 1, limite);
        }

    } catch (erro) {
        console.error(`❌ Erro ao acessar ${url}: ${erro.message}`);
    }
}
// Início do crawler com link inicial
const urlInicial = 'https://amandasantos312.github.io/ProgrInternet1/buscador/paginas/blade_runner.html';
crawler(urlInicial);