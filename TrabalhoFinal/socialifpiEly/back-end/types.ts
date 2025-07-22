export interface Comentario {
    id: number;
    autor: string;
    conteudo: string;
    data: string;
}

export interface PostagemComComentarios {
    id: number;
    titulo: string;
    conteudo: string;
    data: Date;
    curtidas: number;
    comentarios: Comentario[];
}