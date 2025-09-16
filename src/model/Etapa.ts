import { StatusEtapa } from "./Enums";
import Funcionario  from "./Funcionario";

export default class Etapa {
    nome: string;
    prazo: string;
    status: StatusEtapa;
    
    funcionarios: Funcionario[];

    constructor(nome: string, prazo: string) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = StatusEtapa.PENDENTE;
        this.funcionarios = [];
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
        const funcionarioExiste = this.funcionarios.find(f => f.id === funcionario.id);

        if (funcionarioExiste) {
            console.log(`Funcionário ${funcionario.nome} já está associado à etapa ${this.nome}.`);
        } else {
            this.funcionarios.push(funcionario);
            console.log(`Funcionário ${funcionario.nome} associado à etapa ${this.nome}.`);
        }
    }

    public listarFuncionarios(): Funcionario[] {
        console.log(`---- Lista de Funcionários - Etapa: ${this.nome}` );
        if (this.funcionarios.length === 0) {
            console.log("Nenhum funcionário associado a esta etapa.");
            return [];
        }

        this.funcionarios.forEach(f => {
            console.log(`${f.id + 1}: ${f.nome}`);
        });
        return this.funcionarios
    }
}
