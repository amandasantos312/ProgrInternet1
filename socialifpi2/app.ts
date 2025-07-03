import express, {Request, Response} from "express";
import Cors from 'cors';

const app = express();
app.use(express.json());

const URI = "/socialifpi2";
const RECURSO = "/postagens"
const PORTA = 3000;

app.use(Cors());

app.get(URI, (request, response) => {
    response.send({"mensagem": "hello world"});
});

let postagens = [
    {id: 1, texto: "minha primeira postagem", curtidas: 10},
    {id: 2, texto: "minha nova postagem", curtidas: 5},
];

app.get(URI+RECURSO, (request, response) => {
    response.send(postagens);
});

app.get(URI+RECURSO+"/:id", (request, response) => {
    const id = Number(request.params.id);
    
    let postagem = postagens.find(p => p.id == id);

    if(!postagem){
        response.status(404).send({"mensagem" : "Postagem não encontrada"});
        return;
    }

    response.send(postagem);
});

app.post(URI+RECURSO, (request, response) => {
    let {id, texto, curtidas} = request.body;

    let postagem = postagens.find(p => p.id == Number(id));

    if (postagem) {
        response.status(500).send({"mensagem" : "Postagem não encontrada"});
        return;
    }
    postagens.push({id, texto, curtidas});
    response.status(201).send({mensagem: "Postagem incluída com sucesso."});
});

app.listen(PORTA, () => {
    console.log("Servidor rodando");
});