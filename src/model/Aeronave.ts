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

    detalhes(): void { 
        console.log('--- Detalhes da Aeronave ---');
        console.log(`Código: ${this.codigo}`);
        console.log(`Modelo: ${this.modelo}`);
        console.log(`Tipo: ${this.tipo}`);
        console.log(`Capacidade: ${this.capacidade} passageiros`);
        console.log(`Alcance: ${this.alcance} km`);
        console.log('---------------------------');

        console.log(`--- Peças Associadas: ${this.pecas.length} ---`);
        if (this.pecas.length === 0) {
            console.log('Nenhuma peça cadastrada.');
        } else {
            this.pecas.forEach(peca => {
                console.log(`Peça: ${peca.nome}, Tipo: ${peca.tipo}, Status: ${peca.status}`);
            });
        }
        console.log('---------------------------');

        console.log(`--- Etapas Associadas: ${this.etapas.length} ---`);
        if (this.etapas.length === 0) {
            console.log('Nenhuma etapa cadastrada.');
        } else {
            this.etapas.forEach(etapa => {
                console.log(`Etapa: ${etapa.nome}, Status: ${etapa.status}, Prazo: ${etapa.prazo}`);
            });
        }
        console.log('---------------------------');

        console.log(`--- Testes Associados: ${this.testes.length} ---`);
        if (this.testes.length === 0) {
            console.log('Nenhum teste cadastrado.');
        } else {
            this.testes.forEach(teste => {
                console.log(`Teste: ${teste.tipo}, Resultado: ${teste.resultado}`);
            });
        }
        console.log('---------------------------');
    }
}