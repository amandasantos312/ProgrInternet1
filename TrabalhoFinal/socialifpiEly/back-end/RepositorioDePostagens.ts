import { Postagem } from './Postagem';
import { Comentario } from './types';
import * as fs from 'fs';
import * as path from 'path';


export class RepositorioDePostagens {
    private postagens: Postagem[] = [];
    private nextId: number = 1;
    private readonly caminhoDB = path.resolve(__dirname, 'db.json');

    constructor() {
        this.carregarDeArquivo();

        if (this.postagens.length === 0) {
            this.povoar();
        }
    }

    private carregarDeArquivo(): void {
        if (fs.existsSync(this.caminhoDB)) {
            const conteudo = fs.readFileSync(this.caminhoDB, 'utf-8');
            try {
                const objetosSalvos = JSON.parse(conteudo);
                
                // LÓGICA CORRIGIDA ABAIXO
                this.postagens = objetosSalvos.map((obj: any) => {
                    // 1. Cria a postagem base (que terá this.comentarios = [])
                    const postagem = new Postagem(
                        obj.id,
                        obj.titulo,
                        obj.conteudo,
                        new Date(obj.data),
                        obj.curtidas
                    );
                
                    // 2. Se o objeto salvo tinha comentários, atribui eles à nova postagem
                    if (obj.comentarios && Array.isArray(obj.comentarios)) {
                        postagem.comentarios = obj.comentarios;
                    }
                
                    return postagem;
                });
                // FIM DA LÓGICA CORRIGIDA
            
                const maiorId = Math.max(...this.postagens.map(p => p.getId()), 0);
                this.nextId = maiorId + 1;
                console.log(`Carregado ${this.postagens.length} postagens do db.json`);
            } catch (erro) {
                console.error('Erro ao carregar o db.json:', erro);
                this.postagens = [];
            }
        } else {
            console.log("Nenhum db.json encontrado. Será criado um novo ao salvar!");
        }
    }
        

    public adicionarComentario(postagemId: number, autor: string, conteudo: string): boolean {
        try {
            const postagem = this.consultar(postagemId);
            if (postagem) {
                const novoComentario = {
                    id: Date.now(),
                    autor,
                    conteudo,
                    data: new Date().toISOString()
                };

                if (!postagem.comentarios) {
                    postagem.comentarios = [];
                }
                postagem.comentarios.push(novoComentario);
                this.salvarEmArquivo();
                return true;
            }
            return false;
        } catch (erro) {
            console.error('Erro ao adicionar comentário:', erro);
            return false;
        }
    }

    // Método para listar comentários de uma postagem
    public listarComentarios(postagemId: number): Comentario[] | null {
        const postagem = this.consultar(postagemId);
        return postagem ? postagem.comentarios || [] : null;
    }

    private salvarEmArquivo(): void {
        try {
            const dadosParaSalvar = this.postagens.map(postagem => ({
                id: postagem.getId(),
                titulo: postagem.getTitulo(),
                conteudo: postagem.getConteudo(),
                data: postagem.getData().toISOString(),
                curtidas: postagem.getCurtidas(),
                comentarios: postagem.comentarios //Vai incluir comentários
            }));

            fs.writeFileSync(this.caminhoDB, JSON.stringify(dadosParaSalvar, null, 4));
            console.log(`Banco salvo com ${this.postagens.length} postagens.`);
        } catch (erro) {
            console.error('Erro ao salvar no db.json:', erro);
        }
    }


    // Método para incluir uma nova postagem
    public incluir(postagem: Postagem): Postagem | null {
        try {
            const existe = this.postagens.some(p => 
                p.getTitulo() === postagem.getTitulo() && 
                p.getConteudo() === postagem.getConteudo()
            );
        
            if (existe) {
                console.log('Postagem duplicada não será adicionada');
                return null;
            }

            postagem['id'] = this.nextId++;
            this.postagens.push(postagem);
            this.salvarEmArquivo(); //sempre salvar quando incluir
            return postagem;
        } catch (erro) {
            console.error('Erro ao incluir postagem: ', erro);
            return null;
        }
    }

    // Método para alterar uma postagem existente
    public alterar(id: number, titulo: string, conteudo: string, data: Date, curtidas: number) : boolean {
        try {
            const postagem = this.consultar(id);
            if (postagem) {
                postagem['titulo'] = titulo;
                postagem['conteudo'] = conteudo;
                postagem['data'] = data;
                postagem['curtidas'] = curtidas;
                this.salvarEmArquivo(); //sempre salvar quando alterar
                return true;
            }
            return false;
        } catch (erro) {
            console.error('Erro ao alterar postagem: ', erro);
            return false;
        }
    }

    // Método para consultar uma postagem pelo ID
    public consultar(id: number): Postagem | undefined {
        return this.postagens.find(postagem => postagem.getId() == id);
    }

    // Método para excluir uma postagem pelo ID
    public excluir(id: number): boolean {
        try {
            const index = this.postagens.findIndex(postagem => postagem.getId() == id);
            if (index != -1) {
                this.postagens.splice(index, 1);
                this.salvarEmArquivo(); //sempre salvar quando excluir algo
                return true;
            }
            return false;
        } catch (erro) {
            console.error('Erro ao excluir postagem: ', erro);
            return false;
        }
    }

    // Método para curtir uma postagem pelo ID
    public curtir(id: number): number | null {
        try {
            const postagem = this.consultar(id);
            if (postagem) {
                postagem['curtidas'] = postagem.getCurtidas() + 1;
                this.salvarEmArquivo(); //salvar as curtidas
                return postagem.getCurtidas();
            }
            return null;
        } catch (erro) {
            console.error('Erro ao curtir postagem:', erro);
            return null;
        }
        
    }

    // Método para gerar uma data aleatória dentro de um intervalo de anos
    private gerarDataAleatoria(anosPassados: number = 5): Date {
        const hoje = new Date();
        const anoInicial = hoje.getFullYear() - anosPassados;
        const anoAleatorio = Math.floor(Math.random() * (hoje.getFullYear() - anoInicial)) + anoInicial;
        const mesAleatorio = Math.floor(Math.random() * 12);
        const diaAleatorio = Math.floor(Math.random() * 28) + 1; // Considerando 28 dias para evitar problemas com fevereiro
        return new Date(anoAleatorio, mesAleatorio, diaAleatorio);
    }

    // Método para povoar o array com instâncias de Postagem com datas aleatórias e conteúdos mais longos
    public povoar(): void {
        if (this.postagens.length > 0) {
            console.log('Banco já contém postagens, pulando povoamento!')
            return;
        }

        this.incluir(new Postagem(
            1,
            'A Importância da Educação',
            'A educação é a base para uma sociedade mais justa e equitativa. ' +
            'Ela promove o desenvolvimento individual e coletivo, ' +
            'permitindo que pessoas realizem seu potencial. ' +
            'Investir em educação é investir no futuro de todos nós.',
            this.gerarDataAleatoria(),
            10
        ));
        this.incluir(new Postagem(
            2,
            'Tecnologia e Inovação',
            'Vivemos em uma era onde a tecnologia avança a passos largos. ' +
            'Inovações constantes estão mudando a forma como vivemos, trabalhamos e nos comunicamos. ' +
            'É essencial acompanhar essas mudanças para não ficarmos para trás. ' +
            'A tecnologia tem o poder de transformar o mundo em que vivemos.',
            this.gerarDataAleatoria(),
            15
        ));
        this.incluir(new Postagem(
            3,
            'Sustentabilidade Ambiental',
            'Preservar o meio ambiente é crucial para o futuro das próximas gerações. ' +
            'Cada ação nossa tem um impacto, e precisamos ser conscientes das nossas escolhas. ' +
            'A sustentabilidade não é uma opção, mas uma necessidade urgente. ' +
            'Devemos agir agora para garantir um planeta habitável no futuro.',
            this.gerarDataAleatoria(),
            20
        ));
        this.incluir(new Postagem(
            4,
            'Saúde e Bem-Estar',
            'Manter o bem-estar físico e mental é essencial para uma vida equilibrada. ' +
            'O cuidado com a saúde deve ser uma prioridade diária. ' +
            'Pequenos hábitos saudáveis podem fazer uma grande diferença a longo prazo. ' +
            'Não negligencie seu bem-estar, ele é a chave para uma vida plena.',
            this.gerarDataAleatoria(),
            8
        ));
        this.incluir(new Postagem(
            5,
            'Economia Digital',
            'A transformação digital está mudando a maneira como fazemos negócios. ' +
            'Empresas que não se adaptam a essa nova realidade correm o risco de ficar obsoletas. ' +
            'A digitalização não é apenas uma tendência, mas uma necessidade para a sobrevivência no mercado. ' +
            'O futuro é digital, e devemos nos preparar para ele.',
            this.gerarDataAleatoria(),
            12
        ));
        this.incluir(new Postagem(
            6,
            'Impacto das Redes Sociais',
            'As redes sociais têm um papel central na comunicação moderna. ' +
            'Elas conectam pessoas em todo o mundo, criando novas formas de interação. ' +
            'No entanto, também trazem desafios, como a disseminação de informações falsas. ' +
            'É crucial usar essas ferramentas de forma responsável e consciente.',
            this.gerarDataAleatoria(),
            7
        ));
        this.incluir(new Postagem(
            7,
            'Mobilidade Urbana',
            'Soluções de mobilidade inteligente são o futuro das grandes cidades. ' +
            'O crescimento populacional exige novas abordagens para o transporte urbano. ' +
            'A integração de tecnologia no transporte pode melhorar a qualidade de vida nas cidades. ' +
            'Investir em mobilidade sustentável é essencial para um futuro melhor.',
            this.gerarDataAleatoria(),
            9
        ));
        this.incluir(new Postagem(
            8,
            'Educação Financeira',
            'Gerir as finanças pessoais é fundamental para a estabilidade econômica. ' +
            'A educação financeira deve começar desde cedo, para evitar problemas no futuro. ' +
            'Entender como o dinheiro funciona é o primeiro passo para uma vida financeira saudável. ' +
            'Planejamento e controle são as chaves para o sucesso financeiro.',
            this.gerarDataAleatoria(),
            5
        ));
        this.incluir(new Postagem(
            9,
            'Alimentação Saudável',
            'Uma dieta equilibrada é essencial para manter corpo e mente saudáveis. ' +
            'Os alimentos que consumimos impactam diretamente nossa saúde e bem-estar. ' +
            'Fazer escolhas alimentares conscientes pode prevenir doenças e melhorar a qualidade de vida. ' +
            'Invista em uma alimentação rica em nutrientes e pobre em alimentos processados.',
            this.gerarDataAleatoria(),
            11
        )); 
        this.incluir(new Postagem(
            10,
            'Inovações na Saúde',
            'A tecnologia está revolucionando o setor de saúde com novos tratamentos. ' +
            'Inovações como a telemedicina estão tornando o atendimento mais acessível. ' +
            'A pesquisa e o desenvolvimento em saúde estão em um ritmo acelerado, trazendo esperança para muitas doenças. ' +
            'O futuro da saúde está cada vez mais integrado com a tecnologia.',
            this.gerarDataAleatoria(),
            13
        ));
    }

    // Método para listar todas as postagens
    public listar(): Postagem[] {
        return this.postagens.sort((a, b) => new Date(b.getData()).getTime() - new Date(a.getData()).getTime());
    }
}