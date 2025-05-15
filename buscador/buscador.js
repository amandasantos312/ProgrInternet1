const fs = require('fs');

const arquivoDados = 'dados.json';

function carregarDados() {
  if (fs.existsSync(arquivoDados)) {
    return JSON.parse(fs.readFileSync(arquivoDados, 'utf-8'));
  }
  console.log('Arquivo de dados não encontrado.');
  return [];
}

function calcularPontuacao(pagina, palavra) {
  const regex = new RegExp(palavra, 'gi');
  const ocorrencias = (pagina.conteudo.match(regex) || []).length;
  const linksRecebidos = pagina.links.length;
  const autoreferencia = pagina.links.includes(pagina.url);

  let pontos = ocorrencias * 5 + linksRecebidos * 10;
  if (autoreferencia) pontos -= 15;

  return { pontos, ocorrencias, linksRecebidos, autoreferencia };
}

function buscarPalavraChave(palavra) {
  const dados = carregarDados();
  const resultados = [];

  dados.forEach((pagina) => {
    const { pontos, ocorrencias, linksRecebidos, autoreferencia } = calcularPontuacao(pagina, palavra);
    if (ocorrencias > 0) {
      resultados.push({
        url: pagina.url,
        pontos,
        ocorrencias,
        linksRecebidos,
        autoreferencia
      });
    }
  });

  resultados.sort((a, b) => {
    if (b.pontos !== a.pontos) return b.pontos - a.pontos;
    if (b.linksRecebidos !== a.linksRecebidos) return b.linksRecebidos - a.linksRecebidos;
    return b.ocorrencias - a.ocorrencias;
  });

  if (resultados.length === 0) {
    console.log(`Nenhum resultado encontrado para "${palavra}".`);
    return;
  }

  console.log(`\nResultados para "${palavra}":\n`);

  resultados.forEach((res, i) => {
    console.log(`${i + 1}. URL: ${res.url}`);
    console.log(`   Pontos: ${res.pontos}`);
    console.log(`   Ocorrências do termo: ${res.ocorrencias}`);
    console.log(`   Links recebidos: ${res.linksRecebidos}`);
    console.log(`   Autoreferência: ${res.autoreferencia ? 'Sim' : 'Não'}`);
    console.log('---------------------------------------------------');
  });
}

// Se quiser chamar direto, por exemplo:
buscarPalavraChave("Matrix");