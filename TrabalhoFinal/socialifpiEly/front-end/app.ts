function getById(id: string): HTMLElement | null {
    return document.getElementById(id);
}

const apiUrl = 'http://localhost:3000/socialifpi/postagem';  // Atualize a URL conforme necessário

interface Comentario {
    id: number;
    autor: string;
    conteudo: string;
    data: string;
}

interface Postagem {
    id: number;
    titulo: string;
    conteudo: string;
    data: string;
    curtidas: number;
    comentarios: Comentario[];
}

// Função para listar todas as postagens
async function listarPostagens() {
    const response = await fetch(apiUrl);
    const postagens: Postagem[] = await response.json();
    const postagensElement = getById('postagens');
    
    if (!postagensElement) return;
    
    postagensElement.innerHTML = '';  // Limpa as postagens anteriores

    postagens.forEach(postagem => {
        const article = document.createElement('article');
        article.className = 'postagem';

        const titulo = document.createElement('h2');
        titulo.className = 'postagem-titulo';
        titulo.textContent = postagem.titulo;

        const conteudo = document.createElement('p');
        conteudo.className = 'postagem-conteudo';
        conteudo.textContent = postagem.conteudo;

        const metadados = document.createElement('div');
        metadados.className = 'postagem-metadados';

        const data = document.createElement('span');
        data.className = 'postagem-data';
        data.textContent = new Date(postagem.data).toLocaleDateString();

        const curtidas = document.createElement('p');
        curtidas.className = 'postagem-curtidas';
        curtidas.textContent = `Curtidas: ${postagem.curtidas}`;
        //curtidas.style.fontWeight = 'bold';

        const botaoCurtir = document.createElement('button');
        botaoCurtir.className = 'postagem-curtir';
        botaoCurtir.textContent = 'Curtir';
        botaoCurtir.addEventListener('click', () => curtirPostagem(postagem.id, curtidas));

        //Parte de Comentários:
        const comentariosContainer = document.createElement('div');
        comentariosContainer.className = 'comentarios-container';

        const tituloComentarios = document.createElement('h3');
        tituloComentarios.textContent = 'Comentários';

        const comentariosLista = document.createElement('div');
        comentariosLista.className = 'comentarios-lista';

        //Formulario de novo Comentário:
        const formComentario = document.createElement('form');
        formComentario.className = 'comentario-form';

        const inputAutor = document.createElement('input');
        inputAutor.type = 'text';
        inputAutor.placeholder = 'Seu nome';
        inputAutor.required = true;

        const textareaConteudo = document.createElement('textarea');
        textareaConteudo.placeholder = 'Seu comentário';
        textareaConteudo.required = true;

        const botaoComentar = document.createElement('button');
        botaoComentar.type = 'submit';
        botaoComentar.textContent = 'Comentar';

        formComentario.appendChild(inputAutor);
        formComentario.appendChild(textareaConteudo);
        formComentario.appendChild(botaoComentar);

        comentariosContainer.appendChild(tituloComentarios);
        comentariosContainer.appendChild(comentariosLista);
        comentariosContainer.appendChild(formComentario);

        metadados.appendChild(data);
        metadados.appendChild(curtidas);
        metadados.appendChild(botaoCurtir);

        article.appendChild(titulo);
        article.appendChild(conteudo);
        article.appendChild(metadados);
        article.appendChild(comentariosContainer);

        postagensElement.appendChild(article);

        formComentario.addEventListener('submit', async (e) => {
            e.preventDefault();
            const sucess = await adicionarComentario(postagem.id, inputAutor.value, textareaConteudo.value);
            if (sucess) {
                textareaConteudo.value = '';
                await carregarComentarios(postagem.id, comentariosLista);
            }
        });


        // Carrega os comentários existentes
        carregarComentarios(postagem.id, comentariosLista);
        });
    }


// Função para curtir uma postagem
async function curtirPostagem(id: number, curtidasElement: HTMLParagraphElement) {
    const response = await fetch(`${apiUrl}/${id}/curtir`, {
        method: 'POST'
    });
    const result = await response.json();
    curtidasElement.textContent = `Curtidas: ${result.curtidas}`;
}

async function carregarComentarios(postagemId: number, container: HTMLElement) {
    try {
        const response = await fetch(`${apiUrl}/${postagemId}/comentarios`);

        if (!response.ok) throw new Error('Erro ao carregar comentários');
        
        const comentarios: Comentario[] = await response.json();
        
        // Limpa o container antes de adicionar os novos comentários
        container.innerHTML = '';
        
        // Adiciona cada comentário à lista
        container.innerHTML = '<p>Carregando comentários...</p>'; // Se quiser, pode exibir uma mensagem antes

        container.innerHTML = ''; // limpa antes de inserir os comentários

        comentarios.forEach(comentario => {
            const divComentario = document.createElement('div');
            divComentario.className = 'comentario';

            const autor = document.createElement('strong');
            autor.textContent = comentario.autor;

            const conteudo = document.createElement('p');
            conteudo.textContent = comentario.conteudo;

            const data = document.createElement('small');
            data.textContent = new Date(comentario.data).toLocaleString();

            divComentario.appendChild(autor);
            divComentario.appendChild(conteudo);
            divComentario.appendChild(data);

            container.appendChild(divComentario);
        });

    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
        container.innerHTML = '<p>Não foi possível carregar os comentários</p>';
    }
}

async function adicionarComentario(postagemId: number, autor: string, conteudo: string): Promise<boolean> {
    console.log('Tentando adicionar comentário: ', {postagemId, autor, conteudo});
    try {
        // Validação simples dos campos
        if (!autor.trim() || !conteudo.trim()) {
            alert('Por favor, preencha todos os campos do comentário');
            return false;
        }

        const response = await fetch(`${apiUrl}/${postagemId}/comentarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                autor: autor.trim(),
                conteudo: conteudo.trim()
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar comentário');
        }

        return true;
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        alert('Erro ao adicionar comentário. Tente novamente.');
        return false;
    }
}

// Função para incluir uma nova postagem
async function incluirPostagem() {
    const tituloInput = <HTMLInputElement>getById('titulo');
    const conteudoInput = <HTMLInputElement>getById('conteudo');

    if (tituloInput && conteudoInput) {
        const novaPostagem = {
            titulo: tituloInput.value,
            conteudo: conteudoInput.value,
            data: new Date().toISOString(),
            curtidas: 0
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaPostagem)
        });

        const postagemIncluida = await response.json();
        listarPostagens();  // Atualiza a lista de postagens

        // Limpa os campos do formulário
        tituloInput.value = '';
        conteudoInput.value = '';
    }
}

// Inicializa a aplicação
listarPostagens();

const botaoNovaPostagem = getById("botaoNovaPostagem");
if (botaoNovaPostagem) {
    botaoNovaPostagem.addEventListener('click', incluirPostagem);
}

