import { NivelPermissao } from "./Enums";

export default class Funcionario { 
    private id: string;
    private nome: string;
    private telefone: string;
    private endereco: string;
    private usuario: string;
    private senha: string;
    private nivelPermissao:  NivelPermissao;

    constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senha: string, nivelPermissao: NivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }

    // Getters
    get getId(): string {
        return this.id;
    }

    get getNome(): string {
        return this.nome;
    }

    get getTelefone(): string {
        return this.telefone;
    }

    get getEndereco(): string {
        return this.endereco;
    }

    get getUsuario(): string {
        return this.usuario;
    }

    get getSenha(): string {
        return this.senha;
    }

    get getNivelPermissao(): NivelPermissao {
        return this.nivelPermissao;
    }

    // Setters
    set setId(id: string) {
        this.id = id;
    }

    set setNome(nome: string) {
        this.nome = nome;
    }

    set setTelefone(telefone: string) {
        this.telefone = telefone;
    }

    set setEndereco(endereco: string) {
        this.endereco = endereco;
    }

    set setUsuario(usuario: string) {
        this.usuario = usuario;
    }

    set setSenha(senha: string) {
        this.senha = senha;
    }

    set setNivelPermissao(nivelPermissao: NivelPermissao) {
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