// Importando os módulos necessários
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const urlModule = require('url');

// Arquivo que armazena todo o conteúdo coletado
const arquivoDados = 'dados.json';
const arquivoVisitados = 'visitados.json';

// Função para carregar dados já salvos
function carregarDados() {
  if (fs.existsSync(arquivoDados)) {
    return JSON.parse(fs.readFileSync(arquivoDados, 'utf-8'));
  }
  return [];
}

// Função para salvar todos os dados
function salvarDados(dados) {
  fs.writeFileSync(arquivoDados, JSON.stringify(dados, null, 2));
}

// Função para carregar páginas já visitadas
function carregarVisitados() {
  if (fs.existsSync(arquivoVisitados)) {
    return JSON.parse(fs.readFileSync(arquivoVisitados, 'utf-8'));
  }
  return {};
}

// Função para salvar páginas visitadas
function salvarVisitados(visitados) {
  fs.writeFileSync(arquivoVisitados, JSON.stringify(visitados, null, 2));
}

// Função principal do crawler
async function crawlPagina(url, visitados = carregarVisitados(), dados = carregarDados()) {
  if (visitados[url]) {
    console.log(`Página já visitada: ${url}`);
    return;
  }
  try {
    const resposta = await axios.get(url);
    const $ = cheerio.load(resposta.data);
    const links = [];

    $('a').each((i, elemento) => {
      let href = $(elemento).attr('href');
      if (href) {
        // Transformar link relativo em absoluto
        if (!href.startsWith('http')) {
          href = urlModule.resolve(url, href);
        }
        links.push(href);
      }
    });

    // Adiciona os dados ao arquivo único
    dados.push({
      url,
      conteudo: resposta.data,
      links
    });
    salvarDados(dados);

    // Marca a página como visitada
    visitados[url] = true;
    salvarVisitados(visitados);

    console.log(`Página salva: ${url}`);

    // Exploração recursiva dos links encontrados
    for (const link of links) {
      await crawlPagina(link, visitados, dados);
    }
  } catch (erro) {
    console.error(`Erro ao acessar a página ${url}:`, erro.message);
  }
}

// Exemplo de uso:
crawlPagina('https://amandasantos312.github.io/ProgrInternet1/buscador2/paginas/chegada.html');