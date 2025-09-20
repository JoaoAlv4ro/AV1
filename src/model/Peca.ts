import { TipoPeca, StatusPeca } from "./Enums";

export default class Peca { 
    private nome: string;
    private tipo: TipoPeca;
    private fornecedor: string;
    private status: StatusPeca;

    constructor(nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = status;
    }

    // Getters
    get getNome(): string {
        return this.nome;
    }

    get getTipo(): TipoPeca {
        return this.tipo;
    }

    get getFornecedor(): string {
        return this.fornecedor;
    }

    get getStatus(): StatusPeca {
        return this.status;
    }

    // Setters
    set setNome(nome: string) {
        this.nome = nome;
    }

    set setTipo(tipo: TipoPeca) {
        this.tipo = tipo;
    }

    set setFornecedor(fornecedor: string) {
        this.fornecedor = fornecedor;
    }

    set setStatus(status: StatusPeca) {
        this.status = status;
    }
}
