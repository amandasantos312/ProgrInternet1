import { Comentario } from './types';

export class Postagem {
    private id: number;
    private titulo: string;
    private conteudo: string;
    private data: Date;
    private curtidas: number;
    private descurtidas: number;
    public comentarios: Comentario[];

    constructor(id: number, titulo: string, conteudo: string, data: Date, curtidas: number, descurtidas: number) {
        this.id = id;
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.data = data;
        this.curtidas = curtidas;
        this.descurtidas = descurtidas || 0;
        this.comentarios = [];
    }

    public getId(): number {
        return this.id;
    }

    public getTitulo(): string {
        return this.titulo;
    }

    public getConteudo(): string {
        return this.conteudo;
    }

    public getData(): Date {
        return this.data;
    }

    public getCurtidas(): number {
        return this.curtidas;
    }

    public getDescurtidas(): number {
        return this.descurtidas;
    }

    public getComentarios(): Comentario[] {
        return this.comentarios;
    }

    public descurtir(): void {
        this.descurtidas++;
    }
}