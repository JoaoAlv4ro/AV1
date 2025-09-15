import { TipoPeca, StatusPeca } from "./Enums";

export default class Peca { 
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;

    constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = status;
    }
}
