function getById(id) {
    return document.getElementById(id);
}

let botaoPesquisarPost = getById("botaoPesquisarPost");

botaoPesquisarPost.addEventListener("click", pesquisarPost);

let url = "http://localhost:3000/socialifpi2/postagens";

async function pesquisarPost() {
    let idPost = getById("idPost").value;

    url = url + "/" + idPost;

    let response = await fetch(url);
    let json = await response.json();

    if (!response.ok) {
        getById("erro").innerText = "Erro ao consultar post";
        return;
    }

    getById("id").innerText = json.id;
    getById("texto").innerText = json.texto;
    getById("curtidas").innerText = json.curtidas;
}

let botaoPostar = getById("botaoPostar");
botaoPostar.addEventListener("click", postar);

async function postar() {
    let idNovaPostagem = getById("idNovaPostagem");
    let textoNovaPostagem = getById("textoNovaPostagem");

    let novaPostagem = {
        id: idNovaPostagem.value,
        texto: textoNovaPostagem.value,
    }
    /*
    const request = new Request(url, {
        method: "POST",
                    headers: {
                'Content-Type': 'application/json'
            },
        body: JSON.stringify(novaPostagem),
    });*/
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaPostagem),
    });

    if (!response.ok) {
        getById("resultado").innerText = "Erro ao incluir postagem";
        return;
    }

    let json = await response.json();
    getById("resultado").innerText = json.mensagem;
};