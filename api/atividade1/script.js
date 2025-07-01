function getById(id) {
    return document.getElementById(id)
}

//Piadas:
getById('obter-piada').addEventListener('click', function () {
    fetch('https://official-joke-api.appspot.com/random_joke')
        .then(response => response.json())
        .then(data => {
            getById('piada-saida').textContent = `${data.setup} - ${data.punchline}`;
        })
        .catch(error => console.error('Erro:', error));
});
//

//Feriados:


getById('buscar-feriados').addEventListener('click', () => {
    const ano = getById('ano').value;
    const mes = getById('mes').value;

    if (!ano || !mes) {
        alert('Preencha o ano e o mês corretamente.');
        return;
    }

    const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=BR&year=${ano}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
          const feriados = data.response.holidays;
          const lista = getById('lista-feriados');
          lista.innerHTML = ''; // limpa resultados anteriores

          const feriadosDoMes = feriados.filter(f => {
            const data = new Date(f.date.iso);
            return data.getMonth() + 1 === parseInt(mes);
          });

          if (feriadosDoMes.length === 0) {
            lista.innerHTML = '<li>Nenhum feriado neste mês.</li>';
            return;
          }

          feriadosDoMes.forEach(feriado => {
            const item = document.createElement('li');
            item.textContent = `${feriado.date.iso} - ${feriado.name}`;
            lista.appendChild(item);
          });
        })
        .catch(error => {
          console.error('Erro ao buscar feriados:', error);
          alert('Erro ao buscar feriados.');
        });
});
//curl "https://calendarific.com/api/v2/holidays?api_key=snWppL0zd1U9ImSQpfVkcYaiOmTmzyiZ&country=BR&year=2025&month=5"


//Conversão Moedas:


getById('obter-conversao').addEventListener('click', () => {
  const valor = getById('valor').value;

  fetch(`https://v6.exchangerate-api.com/v6/${apiKeymoeda}/latest/BRL`)
    .then(res => res.json())
    .then(data => {
      const taxa = data.conversion_rates.USD;
      const convertido = (valor * taxa).toFixed(2);
      getById('conversao-saida').textContent = `US$ ${convertido} dólares`;
    })
    .catch(err => console.error('Erro ao buscar taxa:', err));
});


//Gênero pelo Nome:
getById('verificar-genero').addEventListener('click', () => {
    const nome = getById('nome').value.trim();

    if (!nome) {
        alert('Digite um nome válido.');
        return;
      }

      fetch(`https://api.genderize.io?name=${nome}`)
        .then(res => res.json())
        .then(data => {
          if (data.gender) {
            const generoTraduzido = data.gender === 'male' ? 'Masculino' : 'Feminino';
            getById('resultado').textContent = 
              `Nome: ${data.name} → Gênero provável: ${generoTraduzido} (${(data.probability * 100).toFixed(1)}%)`;
          } else {
            getById('resultado').textContent = 'Gênero não identificado para este nome.';
          }
        })
        .catch(error => {
          console.error('Erro na requisição:', error);
         getById('resultado').textContent = 'Erro ao buscar gênero.';
        });
});
//curl "https://api.genderize.io?name=amanda"