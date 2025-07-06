function getById(id) {
    return document.getElementById(id);
}

function criarElemento(p) {
    return document.createElement(p);
}

let tarefas = []; //Array para armazenar todas as tarefas
let idCounter = 1;

const tarefasSalvas = localStorage.getItem("tarefas");
if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas);

    // Atualiza o contador com base no maior ID encontrado
    const ultimoId = Math.max(...tarefas.map(t => t.id), 0);
    idCounter = ultimoId + 1;

    atualizarTabela(); //Mostra as tarefas recuperadas
} 

//2) Crie uma estrutura minimamente aceitável para representar uma tarefa.
function criarTarefa(descricao) { 
    return {
        id: idCounter++,
        descricao: descricao,
        dataInicio: new Date().toLocaleString('pt-BR'),
        dataConclusao: ""
    };
}

function atualizarTabela() {
    const tbody = document.querySelector("#tabelaTarefas tbody");
    tbody.innerHTML = ""; // limpa tudo antes de redesenhar

    tarefas.forEach(tarefa => {
        const linha = tbody.insertRow();

        //Preenche as células da linha com os dados da tarefa
        linha.insertCell(0).textContent = tarefa.id;
        linha.insertCell(1).textContent = tarefa.descricao;
        linha.insertCell(2).textContent = tarefa.dataInicio;
        linha.insertCell(3).textContent = tarefa.dataConclusao;

        const celulaAcoes = linha.insertCell(4);

        const btnConcluirOuReabrir = criarElemento("button");
        btnConcluirOuReabrir.className = "concluirBtn";

        if (!tarefa.dataConclusao) {
            btnConcluirOuReabrir.textContent = "Concluir";
            btnConcluirOuReabrir.onclick = () => {
                tarefa.dataConclusao = new Date().toLocaleString('pt-BR');
                atualizarTabela(); // atualiza a tabela
            };
        } else {
            btnConcluirOuReabrir.textContent = "Reabrir";
            btnConcluirOuReabrir.className = "reabrirBtn";
            btnConcluirOuReabrir.onclick = () => {
                tarefa.dataConclusao = "";
                atualizarTabela(); // atualiza a tabela
            };
        }

        const btnExcluir = criarElemento("button");
        btnExcluir.className = "excluirBtn";
        btnExcluir.textContent = "Excluir";

            // Impede a exclusão se a tarefa estiver finalizada
        if (tarefa.dataConclusao) {
            btnExcluir.disabled = true;
            btnExcluir.title = "Não é possível excluir tarefas concluídas";
        } else {
            btnExcluir.onclick = () => {
                // Confirmação antes de excluir
                const confirmar = confirm("Tem certeza que deseja excluir esta tarefa?");
                if (confirmar) {
                    // Remove a tarefa do array
                    tarefas = tarefas.filter(t => t.id !== tarefa.id);
                    atualizarTabela();
                }
            };
        }

        // Adiciona os botões à célula de ações
        celulaAcoes.appendChild(btnConcluirOuReabrir);
        celulaAcoes.appendChild(btnExcluir);
    });

    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

getById("adicionarBtn").addEventListener("click", () => {
    const input = getById("descricaoTarefa");
    const descricao = input.value.trim();

    //Verifica se a descrição está vazia
    if (!descricao) {
        alert("Digite uma descrição para a tarefa.");
        return;
    }

    // Cria uma nova tarefa e adiciona ao array
    const novaTarefa = criarTarefa(descricao);
    tarefas.push(novaTarefa);

    atualizarTabela();
    input.value = "";
});

/*4.e) Melhorias:
    - Botões estilizados, concluir-verde, reabir-laranja e excluir-vermelho;
    - Footer descrevendo quem devesenvolveu;
    - Conteiner feito e centralizado;
    - Site responsivo;
*/
