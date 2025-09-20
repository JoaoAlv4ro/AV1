import { StatusEtapa } from "./Enums";
import Funcionario  from "./Funcionario";

export default class Etapa {
    private nome: string;
    private prazo: string;
    private status: StatusEtapa;
    
    private funcionarios: Funcionario[];

    constructor(nome: string, prazo: string) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = StatusEtapa.PENDENTE;
        this.funcionarios = [];
    }

    // Getters
    get getNome(): string {
        return this.nome;
    }

    get getPrazo(): string {
        return this.prazo;
    }

    get getStatus(): StatusEtapa {
        return this.status;
    }

    get getFuncionarios(): Funcionario[] {
        return this.funcionarios;
    }

    // Setters
    set setNome(nome: string) {
        this.nome = nome;
    }

    set setPrazo(prazo: string) {
        this.prazo = prazo;
    }

    set setStatus(status: StatusEtapa) {
        this.status = status;
    }

    set setFuncionarios(funcionarios: Funcionario[]) {
        this.funcionarios = funcionarios;
    }

    public iniciarEtapa(): void {
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.ANDAMENTO;
            console.log(`Etapa ${this.nome} Iniciada`);
        } else {
            console.log(`Ação não permitida: A etapa ${this.nome} não está pendente.`);
        }
    }

    public finalizarEtapa(): void {
        if (this.status === StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA;
            console.log(`Etapa ${this.nome} Iniciada`);
        } else {
            console.log(`Ação não permitida: A etapa ${this.nome} não está em andamento.`);
        }
    }

    public associarFuncionario(funcionario: Funcionario): void {
        const funcionarioExiste = this.funcionarios.find(f => f.getId === funcionario.getId);

        if (funcionarioExiste) {
            console.log(`Funcionário ${funcionario.getNome} já está associado à etapa ${this.nome}.`);
        } else {
            this.funcionarios.push(funcionario);
            console.log(`Funcionário ${funcionario.getNome} associado à etapa ${this.nome}.`);
        }
    }

    public listarFuncionarios(): Funcionario[] {
        console.log(`---- Lista de Funcionários - Etapa: ${this.nome}` );
        if (this.funcionarios.length === 0) {
            console.log("Nenhum funcionário associado a esta etapa.");
            return [];
        }

        this.funcionarios.forEach(f => {
            console.log(`${f.getId + 1}: ${f.getNome}`);
        });
        return this.funcionarios
    }
}
