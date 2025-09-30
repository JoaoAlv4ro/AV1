import * as readline from 'readline';
import Aeronave from "../model/Aeronave";
import { TipoAeronave } from "../model/Enums";


export default class GerenciadorAeronave {
    private leitor: readline.Interface;

    constructor() {
        this.leitor = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public gerenciar(aeronave: Aeronave): void {
        console.log("\nMenu de Gerenciamento:");
        console.log("[1] Editar Aeronave");
        console.log("[2] Gerenciar Peças");
        console.log(`[3] Gerenciar Etapas`);
        console.log(`[4] Gerenciar Testes`);
        console.log("[0] Voltar");
        console.log("-------------------------");

        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.editarAeronave(aeronave);
                    break;
                case '2':
                    console.log("Funcionalidade de gerenciamento de peças ainda não implementada.");
                    this.gerenciar(aeronave);
                    break;
                case '3':
                    console.log("Funcionalidade de gerenciamento de etapas ainda não implementada.");
                    this.gerenciar(aeronave);
                    break;
                case '4':
                    console.log("Funcionalidade de gerenciamento de testes ainda não implementada.");
                    this.gerenciar(aeronave);
                    break;
                case '0':
                    this.leitor.close();
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.gerenciar(aeronave);
            }
        });
    }

    private editarAeronave(aeronave: Aeronave): void {
        console.log(`\nEditando Aeronave ${aeronave.getCodigo}`);
        console.log("O que deseja editar?");
        console.log("[1] Modelo");
        console.log("[2] Tipo");
        console.log("[3] Capacidade");
        console.log("[4] Alcance");
        console.log("[0] Voltar");
        console.log("-------------------------");

        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.leitor.question(`Novo modelo: (atual: ${aeronave.getModelo}) `, (novoModelo) => {
                        console.log("Aperte 0 para manter o valor atual.");
                        if (novoModelo !== '0') {
                            aeronave.setModelo = novoModelo;
                            console.log("Modelo atualizado com sucesso!");
                        } else {
                            console.log("Modelo mantido.");
                        }
                        this.editarAeronave(aeronave);
                    });
                    break;
                case '2':
                    console.log("Tipos disponíveis:");
                    Object.values(TipoAeronave).forEach((tipo, index) => {
                        console.log(`[${index + 1}] ${tipo}`);
                    });
                    this.leitor.question(`Escolha o novo tipo: (atual: ${aeronave.getTipo}) `, (tipoIndex) => {
                        const index = parseInt(tipoIndex) - 1;
                        if (index >= 0 && index < Object.values(TipoAeronave).length) {
                            aeronave.setTipo = Object.values(TipoAeronave)[index];
                            console.log("Tipo atualizado com sucesso!");
                        } else {
                            console.log("Opção inválida.");
                        }
                        this.editarAeronave(aeronave);
                    });
                    break;
                case '3':
                    this.leitor.question(`Nova capacidade: (atual: ${aeronave.getCapacidade}) `, (novaCapacidade) => {
                        const capacidade = parseInt(novaCapacidade);
                        if (!isNaN(capacidade) && capacidade > 0) {
                            aeronave.setCapacidade = capacidade;
                            console.log("Capacidade atualizada com sucesso!");
                        } else {
                            console.log("Valor inválido.");
                        }
                        this.editarAeronave(aeronave);
                    });
                    break;
                case '4':
                    this.leitor.question(`Novo alcance: (atual: ${aeronave.getAlcance}) `, (novoAlcance) => {
                        const alcance = parseInt(novoAlcance);
                        if (!isNaN(alcance) && alcance > 0) {
                            aeronave.setAlcance = alcance;
                            console.log("Alcance atualizado com sucesso!");
                        } else {
                            console.log("Valor inválido.");
                        }
                        this.editarAeronave(aeronave);
                    });
                    break;
                case '0':
                    this.gerenciar(aeronave);
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.editarAeronave(aeronave);
            }
        });
    }
}
