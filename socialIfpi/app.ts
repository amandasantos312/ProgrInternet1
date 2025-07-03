import express, {NextFunction, request, Request, response, Response } from "express";

const app = express();
app.use(express.json());


app.get("/socialIfpi/postagens", (request: Request, response: Response) => {
    response.status(200).send("Get executado no servidor");
});

app.post("/socialIfpi/postagens", (request, response) => {
    response.status(201).send("Post executado no servidor");
});

app.delete("/socialIfpi/postagens", (request, response) => {
    response.status(204).send("Delete executado no servidor");
});

app.patch("/socialIfpi/postagens", (request, response) => {
    response.status(200).send("Patch executado no servidor");
});

app.put("/socialIfpi/postagens", (request, response) => {
    response.status(200).send("Put executado no servidor");
});

//Erro
app.get("/socialIfpi/erro", (request, response) => {
    response.status(500).send("Erro interno no servidor");
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Não encontrado');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});

//http://localhost:3000/socialIfpi

/*interface Postagem {
    id: number;
    texto: string;
}

let postagens: Postagem[] = 
[{id: 1, texto: "texto 1"}, {id: 2, texto: "texto 2"}]

app.get("/socialIfpi/postagens/:id", (request: Request, response: Response) => {
    let id = Number(request.params["id"]);
    let postagem = postagens.filter(p => p.id = id);

    if (!postagem) {
        response.status(404).send({})
    }
});

app.get("/socialIfpi/postagem/1", (request: Request, response: Response) => {
    let postagem = {
        "id": 1,
        "titulo": "Minha primeira postagem",
        "texto": "loren ipsum lorem ipsum lorem ipsum"
    }
    response.status(200).send(postagem);
}); */