import express, { NextFunction, Request, Response } from 'express';
import { RepositorioDePostagens } from './RepositorioDePostagens';
import { Postagem } from './Postagem';
import cors from 'cors';

const app = express();
const repositorio = new RepositorioDePostagens();

// Configurações do Express
app.use(express.json());

// Configuração básica do CORS
app.use(cors());


// Endpoint para raiz
const PATH: string = '/socialifpi/postagem';
const PATH_ID: string = PATH + '/:id';
const PATH_CURTIR = PATH_ID + '/curtir';
const PATH_DESCURTIR = PATH_ID + '/descurtir';
const PATH_COMENTARIOS = PATH_ID + '/comentarios';

// Endpoint para adicionar comentário
app.post(PATH_COMENTARIOS, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { autor, conteudo } = req.body;
    
    if (!autor || !conteudo) {
        return res.status(400).json({ message: 'Autor e conteúdo são obrigatórios' });
    }

    const sucesso = repositorio.adicionarComentario(id, autor, conteudo);
    if (!sucesso) {
        return res.status(404).json({ message: 'Postagem não encontrada' });
    }

    res.status(201).json({ message: 'Comentário adicionado com sucesso' });
});

// Endpoint para listar comentários
app.get(PATH_COMENTARIOS, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const comentarios = repositorio.listarComentarios(id);
    
    if (comentarios === null) {
        return res.status(404).json({ message: 'Postagem não encontrada' });
    }

    res.json(comentarios);
});


// Endpoint para listar todas as postagens
app.get(PATH, (req: Request, res: Response) => {
    const postagens = repositorio.listar();
    res.json(postagens);
});

// Endpoint para consultar uma postagem pelo ID
app.get(PATH_ID, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const postagem = repositorio.consultar(id);
    
    if (!postagem) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
        
    } 

    res.json(postagem);
});

// Endpoint para incluir uma nova postagem
app.post(PATH, (req: Request, res: Response) => {
    const { titulo, conteudo, data, curtidas, descurtir } = req.body;
    const novaPostagem = new Postagem(0, titulo, conteudo, new Date(data), curtidas || 0, descurtir || 0);
    const postagemIncluida = repositorio.incluir(novaPostagem);
    res.status(201).json(postagemIncluida);
});

// Endpoint para alterar uma postagem existente
app.put(PATH_ID, (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        //Busca a postagem original no repositório
        const postagemOriginal = repositorio.consultar(id);

        // Se não encontrar a postagem, retorna erro 404
        if (!postagemOriginal) {
            return res.status(404).json({ message: 'Postagem não encontrada' });
        }

        //Pega o título e o conteúdo do corpo da requisição
        const { titulo, conteudo } = req.body;

        // Se os campos essenciais não foram enviados, retorna erro
        if (!titulo || !conteudo) {
            return res.status(400).json({ message: 'Título e conteúdo são obrigatórios.' });
        }

        //Chama o método "alterar" usando os novos dados (titulo, conteudo) preservando os dados antigos (data, curtidas)
        const sucesso = repositorio.alterar(
            id,
            titulo,
            conteudo,
            postagemOriginal.getData(),      // <-- Preserva a data original
            postagemOriginal.getCurtidas()   // <-- Preserva as curtidas originais
        );

        if (!sucesso) {
            // Este erro é improvável de acontecer agora, mas é bom manter
            return res.status(500).json({ message: 'Ocorreu um erro ao alterar a postagem' });
        }

        res.status(200).json({ message: 'Postagem alterada com sucesso' });

    } catch (erro) {
        console.error('Erro no servidor ao alterar postagem:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor.' });
    }
});

// Endpoint para excluir uma postagem pelo ID
app.delete(PATH_ID, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const sucesso = repositorio.excluir(id);
    if (!sucesso) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
    }

    res.status(200).json({ message: 'Postagem excluída com sucesso' });
});

// Endpoint para curtir uma postagem pelo ID
// Endpoint para curtir uma postagem pelo ID e retornar a quantidade de curtidas
app.post(PATH_CURTIR, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const curtidas = repositorio.curtir(id);
    
    if (curtidas == null) {
        res.status(404).json({ message: 'Postagem não encontrada' });
        return;
        
    } 
    
    res.json({ message: 'Postagem curtida com sucesso', curtidas });
});

app.post(PATH_DESCURTIR, (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const descurtidas = repositorio.descurtir(id);

        if (descurtidas === null) {
            return res.status(404).json({ message: 'Postagem não encontrada' });
        }
        
        res.json({ message: 'Postagem descurtida com sucesso', descurtidas });
    } catch (erro) {
        console.error('Erro no servidor ao descurtir:', erro);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

// Inicializar o servidor na porta 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send('Não encontrado');
});