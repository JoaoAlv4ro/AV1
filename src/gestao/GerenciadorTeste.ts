import * as readline from 'readline';
import Aeronave from "../model/Aeronave";
import Teste from "../model/Teste";
import { TipoTeste, ResultadoTeste } from "../model/Enums";

export default class GerenciadorTeste {
    private leitor: readline.Interface;

    constructor(leitor: readline.Interface) {
        this.leitor = leitor;
    }

    public gerenciar(aeronave: Aeronave, onVoltar: () => void): void {
        console.log("\nMenu de Gerenciamento de Testes:");
        console.log("[1] Listar Testes");
        console.log("[2] Adicionar Teste");
        console.log("[3] Realizar/Alterar Resultado do Teste");
        console.log("[4] Remover Teste");
        console.log("[0] Voltar");
        console.log("-------------------------");

        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.listarTestes(aeronave, () => this.gerenciar(aeronave, onVoltar));
                    break;
                case '2':
                    this.adicionarTeste(aeronave, () => this.gerenciar(aeronave, onVoltar));
                    break;
                case '3':
                    this.alterarResultadoTeste(aeronave, () => this.gerenciar(aeronave, onVoltar));
                    break;
                case '4':
                    this.removerTeste(aeronave, () => this.gerenciar(aeronave, onVoltar));
                    break;
                case '0':
                    onVoltar();
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.gerenciar(aeronave, onVoltar);
            }
        });
    }

    private listarTestes(aeronave: Aeronave, onVoltar: () => void): void {
        console.log("\n----- Lista de Testes -----");
        if (aeronave.getTestes.length === 0) {
            console.log("Nenhum teste cadastrado.");
        } else {
            aeronave.getTestes.forEach((teste, index) => {
                console.log(`[${index + 1}] Tipo: ${teste.getTipo}, Resultado: ${teste.getResultado}`);
            });
        }
        console.log("-------------------------");
        
        this.leitor.question("Pressione Enter para voltar...", () => {
            onVoltar();
        });
    }

    private adicionarTeste(aeronave: Aeronave, onVoltar: () => void): void {
        console.log("\nTipos de Teste Disponíveis:");
        Object.values(TipoTeste).forEach((tipo, index) => {
            console.log(`[${index + 1}] ${tipo}`);
        });

        this.leitor.question("Escolha o tipo de teste: ", (opcao) => {
            const index = parseInt(opcao) - 1;
            if (index >= 0 && index < Object.values(TipoTeste).length) {
                const tipoTeste = Object.values(TipoTeste)[index];
                const novoTeste = new Teste(tipoTeste);
                aeronave.adicionarTeste(novoTeste);
                console.log(`Teste ${tipoTeste} adicionado com sucesso!`);
                setTimeout(onVoltar, 1000);
            } else {
                console.log("Opção inválida.");
                setTimeout(onVoltar, 1000);
            }
        });
    }

    private alterarResultadoTeste(aeronave: Aeronave, onVoltar: () => void): void {
        if (aeronave.getTestes.length === 0) {
            console.log("Não há testes cadastrados para alterar.");
            setTimeout(onVoltar, 1000);
            return;
        }

        console.log("\nTestes Disponíveis:");
        aeronave.getTestes.forEach((teste, index) => {
            console.log(`[${index + 1}] ${teste.getTipo} - Resultado Atual: ${teste.getResultado}`);
        });

        this.leitor.question("Escolha o teste para alterar o resultado: ", (testIndex) => {
            const index = parseInt(testIndex) - 1;
            if (index >= 0 && index < aeronave.getTestes.length) {
                console.log("\nResultados Disponíveis:");
                Object.values(ResultadoTeste).forEach((resultado, resIndex) => {
                    console.log(`[${resIndex + 1}] ${resultado}`);
                });

                this.leitor.question("Escolha o novo resultado: ", (resOpcao) => {
                    const resIndex = parseInt(resOpcao) - 1;
                    if (resIndex >= 0 && resIndex < Object.values(ResultadoTeste).length) {
                        const novoResultado = Object.values(ResultadoTeste)[resIndex];
                        aeronave.getTestes[index].realizarTeste(novoResultado);
                        console.log("Resultado do teste atualizado com sucesso!");
                        setTimeout(onVoltar, 1000);
                    } else {
                        console.log("Opção de resultado inválida.");
                        setTimeout(onVoltar, 1000);
                    }
                });
            } else {
                console.log("Teste não encontrado.");
                setTimeout(onVoltar, 1000);
            }
        });
    }

    private removerTeste(aeronave: Aeronave, onVoltar: () => void): void {
        if (aeronave.getTestes.length === 0) {
            console.log("Não há testes cadastrados para remover.");
            setTimeout(onVoltar, 1000);
            return;
        }

        console.log("\nTestes Disponíveis:");
        aeronave.getTestes.forEach((teste, index) => {
            console.log(`[${index + 1}] ${teste.getTipo} - Resultado: ${teste.getResultado}`);
        });

        this.leitor.question("Escolha o teste para remover: ", (opcao) => {
            const index = parseInt(opcao) - 1;
            if (index >= 0 && index < aeronave.getTestes.length) {
                aeronave.removerTeste(index);
                console.log("Teste removido com sucesso!");
                setTimeout(onVoltar, 1000);
            } else {
                console.log("Opção inválida.");
                setTimeout(onVoltar, 1000);
            }
        });
    }
}