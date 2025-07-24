// FUNÇÕES GLOBAIS E INTERFACES
function getById(id: string): HTMLElement | null {
    return document.getElementById(id);
}

const apiUrl = 'http://localhost:3000/socialifpi/postagem';

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
    descurtidas: number;
    comentarios: Comentario[];
}

// Garante que o código só rode quando o HTML estiver pronto
document.addEventListener('DOMContentLoaded', () => {

    const botaoNovaPostagem = getById("botaoNovaPostagem");

    // FUNÇÕES DA APLICAÇÃO
    async function listarPostagens() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Falha ao carregar postagens');
            const postagens: Postagem[] = await response.json();
            const postagensElement = getById('postagens');
            
            if (!postagensElement) return;
            
            postagensElement.innerHTML = '';

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

                const descurtidas = document.createElement('p');
                descurtidas.className = 'postagem-descurtidas';
                descurtidas.textContent = `Descurtidas: ${postagem.descurtidas || 0}`;

                const botaoCurtir = document.createElement('button');
                botaoCurtir.className = 'btn-curtir';
                botaoCurtir.textContent = 'Curtir';
                botaoCurtir.addEventListener('click', () => curtirPostagem(postagem.id, curtidas));
                
                const botaoDescurtir = document.createElement('button');
                botaoDescurtir.className = 'btn-deslike';
                botaoDescurtir.textContent = 'Descurtir';
                botaoDescurtir.addEventListener('click', () => descurtirPostagem(postagem.id, descurtidas));

                const botaoExcluir = document.createElement('button');
                botaoExcluir.className = 'btn-excluir'; 
                botaoExcluir.textContent = 'Excluir';
                botaoExcluir.addEventListener('click', () => excluirPostagem(postagem.id, article));

                const botaoEditar = document.createElement('button');
                botaoEditar.className = 'btn-editar';
                botaoEditar.textContent = 'Editar';
                botaoEditar.addEventListener('click', () => editarPostagem(postagem));
                
                const comentariosContainer = document.createElement('div');
                comentariosContainer.className = 'comentarios-container';

                const tituloComentarios = document.createElement('h3');
                tituloComentarios.textContent = 'Comentários';

                const comentariosLista = document.createElement('div');
                comentariosLista.className = 'comentarios-lista';
                
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
                metadados.appendChild(descurtidas);
                metadados.appendChild(botaoCurtir);
                metadados.appendChild(botaoDescurtir);
                metadados.appendChild(botaoEditar);
                metadados.appendChild(botaoExcluir);

                article.appendChild(titulo);
                article.appendChild(conteudo);
                article.appendChild(metadados);
                article.appendChild(comentariosContainer);

                postagensElement.appendChild(article);

                formComentario.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const sucesso = await adicionarComentario(postagem.id, inputAutor.value, textareaConteudo.value);
                    if (sucesso) {
                        inputAutor.value = '';
                        textareaConteudo.value = '';
                        await carregarComentarios(postagem.id, comentariosLista);
                    }
                });

                carregarComentarios(postagem.id, comentariosLista);
            });
        } catch(error) {
            console.error("Erro fatal ao listar postagens:", error);
            const postagensElement = getById('postagens');
            if(postagensElement) {
                postagensElement.innerHTML = '<p style="color: red;">Não foi possível carregar as postagens. Verifique se o servidor está rodando.</p>';
            }
        }
    }
    
    async function editarPostagem(postagem: Postagem) {
        const novoTitulo = prompt("Edite o título da postagem:", postagem.titulo);
        if (novoTitulo === null) { // Usuário clicou em "Cancelar"
            return;
        }

        const novoConteudo = prompt("Edite o conteúdo da postagem:", postagem.conteudo);
        if (novoConteudo === null) { // Usuário clicou em "Cancelar"
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/${postagem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: novoTitulo, conteudo: novoConteudo }),
            });

            if (response.ok) {
                alert('Postagem atualizada com sucesso!');
                await listarPostagens();
            } else {
                const erro = await response.json();
                alert(`Falha ao atualizar a postagem: ${erro.message}`);
            }
        } catch (error) {
            console.error('Erro de rede ao editar postagem:', error);
            alert('Não foi possível conectar ao servidor para editar a postagem.');
        }
    }

    async function curtirPostagem(id: number, curtidasElement: HTMLParagraphElement) {
        try {
            const response = await fetch(`${apiUrl}/${id}/curtir`, { method: 'POST' });
            const result = await response.json();
            curtidasElement.textContent = `Curtidas: ${result.curtidas}`;
        } catch (error) {
            console.error("Erro ao curtir postagem:", error);
        }
    }
    
    async function descurtirPostagem(id: number, descurtidasElement: HTMLParagraphElement) {
        try {
            const response = await fetch(`${apiUrl}/${id}/descurtir`, { method: 'POST' });
            if (!response.ok) throw new Error('Falha ao descurtir');
            const result = await response.json();
            descurtidasElement.textContent = `Descurtidas: ${result.descurtidas}`;
        } catch (error) {
            console.error("Erro ao descurtir postagem:", error);
        }
    }

    async function excluirPostagem(id: number, articleElement: HTMLElement) {
        const confirmou = confirm('Tem certeza que deseja excluir esta postagem?\nEsta ação não pode ser desfeita.');
        if (!confirmou) return;

        try {
            const response = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                articleElement.remove();
                alert('Postagem excluída com sucesso!');
            } else {
                const erro = await response.json();
                alert(`Falha ao excluir a postagem: ${erro.message || 'Erro desconhecido'}`);
            }
        } catch (error) {
            console.error('Erro de rede ao tentar excluir postagem:', error);
            alert('Não foi possível conectar ao servidor para excluir a postagem.');
        }
    }

    async function carregarComentarios(postagemId: number, container: HTMLElement) {
        try {
            const response = await fetch(`${apiUrl}/${postagemId}/comentarios`);
            if (!response.ok) throw new Error('Erro ao carregar comentários');
            const comentarios: Comentario[] = await response.json();
            container.innerHTML = '';
            comentarios
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .forEach(comentario => {
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

    async function adicionarComentario(postagemId: number, autor: string, conteudo: string) {
        try {
            if (!autor.trim() || !conteudo.trim()) {
                alert('Por favor, preencha todos os campos do comentário');
                return false;
            }
            const response = await fetch(`${apiUrl}/${postagemId}/comentarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ autor: autor.trim(), conteudo: conteudo.trim() })
            });
            return response.ok;
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
            alert('Erro ao adicionar comentário. Tente novamente.');
            return false;
        }
    }

    async function incluirPostagem() {
        const tituloInput = <HTMLInputElement>getById('titulo');
        const conteudoInput = <HTMLInputElement>getById('conteudo');
        if (tituloInput && conteudoInput && tituloInput.value && conteudoInput.value) {
            const novaPostagem = {
                titulo: tituloInput.value,
                conteudo: conteudoInput.value,
                data: new Date().toISOString(),
                curtidas: 0
            };
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novaPostagem)
                });
                if(response.ok) {
                    await listarPostagens();
                    tituloInput.value = '';
                    conteudoInput.value = '';
                }
            } catch(error) {
                console.error("Erro ao incluir postagem:", error);
            }
        }
    }

    if (botaoNovaPostagem) {
        botaoNovaPostagem.addEventListener('click', incluirPostagem);
    }

    listarPostagens();
});