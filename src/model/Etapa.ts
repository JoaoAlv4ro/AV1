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
}