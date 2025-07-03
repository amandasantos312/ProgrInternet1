import express, { NextFunction, Request, Response } from "express";

const app = express();
app.use(express.json());



app.get("/socialifpi/postagens", (request: Request, response: Response) => {
    response.status(200).send("Get executado no servidor");
});

app.post("/socialifpi/postagens", (request, response) => {
    response.status(201).send("Post executado no servidor");
});

app.delete("/socialifpi/postagens", (request, response) => {
    response.status(204).send("Delete executado no servidor");
});

app.patch("/socialifpi/postagens", (request, response) => {
    response.status(200).send("Patch executado no servidor");
});

app.put("/socialifpi/postagens", (request, response) => {
    response.status(200).send("Put executado no servidor");
});

app.get("/socialifpi/erro", (request, response) => {
    response.status(500).send("Erro interno no servidor");
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Não encontrado');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});




//http://localhost:3000/socialifpi

