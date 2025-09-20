import Etapa from './Etapa';
import Peca from './Peca';
import Teste from './Teste';
import { TipoAeronave } from './Enums';

export default class Aeronave { 
    private codigo: string;
    private modelo: string;
    private tipo: TipoAeronave;
    private capacidade: number;
    private alcance: number;

    private pecas: Peca[];
    private etapas: Etapa[]
    private testes: Teste[];

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

    // Getters
    get getCodigo(): string {
        return this.codigo;
    }

    get getModelo(): string {
        return this.modelo;
    }

    get getTipo(): TipoAeronave {
        return this.tipo;
    }

    get getCapacidade(): number {
        return this.capacidade;
    }

    get getAlcance(): number {
        return this.alcance;
    }

    get getPecas(): Peca[] {
        return this.pecas;
    }

    get getEtapas(): Etapa[] {
        return this.etapas;
    }

    get getTestes(): Teste[] {
        return this.testes;
    }

    // Setters
    set setCodigo(codigo: string) {
        this.codigo = codigo;
    }

    set setModelo(modelo: string) {
        this.modelo = modelo;
    }

    set setTipo(tipo: TipoAeronave) {
        this.tipo = tipo;
    }

    set setCapacidade(capacidade: number) {
        this.capacidade = capacidade;
    }

    set setAlcance(alcance: number) {
        this.alcance = alcance;
    }

    set setPecas(pecas: Peca[]) {
        this.pecas = pecas;
    }

    set setEtapas(etapas: Etapa[]) {
        this.etapas = etapas;
    }

    set setTestes(testes: Teste[]) {
        this.testes = testes;
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
                console.log(`Peça: ${peca.getNome}, Tipo: ${peca.getTipo}, Status: ${peca.getStatus}`);
            });
        }
        console.log('---------------------------');

        console.log(`--- Etapas Associadas: ${this.etapas.length} ---`);
        if (this.etapas.length === 0) {
            console.log('Nenhuma etapa cadastrada.');
        } else {
            this.etapas.forEach(etapa => {
                console.log(`Etapa: ${etapa.getNome}, Status: ${etapa.getStatus}, Prazo: ${etapa.getPrazo}`);
            });
        }
        console.log('---------------------------');

        console.log(`--- Testes Associados: ${this.testes.length} ---`);
        if (this.testes.length === 0) {
            console.log('Nenhum teste cadastrado.');
        } else {
            this.testes.forEach(teste => {
                console.log(`Teste: ${teste.getTipo}, Resultado: ${teste.getResultado}`);
            });
        }
        console.log('---------------------------');
    }
}