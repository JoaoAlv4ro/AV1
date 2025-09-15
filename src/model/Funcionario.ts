import { NivelPermissao } from "./Enums";

export default class Funcionario { 
    id: string;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao:  NivelPermissao;

    constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }

    public autenticar(usuario: string, senha: string): boolean { 
        if (this.usuario === usuario && this.senha === senha) {
            console.log("Autenticação bem-sucedida.");
            return true;
        }
        console.log("Falha na autenticação.");
        return false;
    }
}