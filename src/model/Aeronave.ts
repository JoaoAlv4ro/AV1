import Etapa from './Etapa';
import Peca from './Peca';
import Teste from './Teste';
import { TipoAeronave } from './Enums';

export default class Aeronave { 
    codigo: string;
    modelo: string
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;

    pecas: Peca[];
    etapas: Etapa[]
    testes: Teste[];

    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;

        this.pecas = [];
        this.etapas = [];
        this.testes = [];
    }
}