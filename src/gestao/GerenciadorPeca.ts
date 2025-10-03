import * as readline from 'readline';
import Aeronave from "../model/Aeronave";
import Peca from '../model/Peca';
import { StatusPeca, TipoPeca } from '../model/Enums';

export default class GerenciadorPeca {
    private leitor: readline.Interface;

    constructor(leitor: readline.Interface) {
        this.leitor = leitor;
    }

    private validarCodigoPeca(codigo: string): boolean {
        // Verifica se é um número e se tem pelo menos 1 dígito
        return /^\d+$/.test(codigo);
    }

    public gerenciar(aeronave: Aeronave, onVoltar: () => void): void { 
        console.log("\nMenu de Gerenciamento de Peças: ");
        console.log("Aeronave: " + aeronave.getModelo);
        console.log("[1] Editar Peça");
        console.log("[2] Adicionar Peça");
        console.log("[3] Listar Peças");
        console.log("[4] Remover Peça");
        console.log("[0] Voltar");
        console.log("-------------------------");
        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.editarPeca(aeronave, () => this.gerenciar(aeronave, onVoltar));
                    break;
                case '2':
                    this.adicionarPeca(aeronave, () => this.gerenciar(aeronave, onVoltar));
                    break;
                case '3':
                    this.listarPecas(aeronave, () => this.gerenciar(aeronave, onVoltar));
                    break;
                case '4':
                    this.removerPeca(aeronave, () => this.gerenciar(aeronave, onVoltar));
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

    private editarPeca(aeronave: Aeronave, onVoltar: () => void): void {
        if (aeronave.getPecas.length === 0) {
            console.log("Nenhuma peça cadastrada para editar.");
            setTimeout(() => onVoltar(), 1000);
            return;
        }
        
        console.log("\n--- Peças Disponíveis ---");
        aeronave.getPecas.forEach(peca => {
            console.log(`Código: ${peca.getCodigo}, Nome: ${peca.getNome}`);
        });
        console.log("-------------------------");

        
        this.leitor.question("Digite o código da peça a ser editada (apenas números): ", (codigo) => {
            if (!this.validarCodigoPeca(codigo)) {
                console.log("Código inválido. Use apenas números.");
                setTimeout(() => onVoltar(), 1000);
                return;
            }
            const peca = aeronave.getPecas.find(p => p.getCodigo === codigo);
            if (peca) {
                console.log(`\nEditando Peça ${peca.getNome}`);
                console.log("O que deseja editar?");
                console.log("[1] Nome");
                console.log("[2] Tipo");
                console.log("[3] Fornecedor");
                console.log("[4] Status");
                console.log("[0] Voltar");
                console.log("-------------------------");
                this.leitor.question("Escolha uma opção: ", (opcao) => {
                    switch (opcao) {
                        case '1':
                            this.leitor.question("Novo nome: ", (novoNome) => {
                                peca.setNome = novoNome;
                                console.log("Nome atualizado com sucesso.");
                                setTimeout(() => onVoltar(), 1000);
                            });
                            break;
                        case '2':
                            console.log("Tipos disponíveis:");
                            console.log("[1] Nacional");
                            console.log("[2] Importada");
                            console.log("-------------------------");
                            this.leitor.question("Digite o novo tipo: ", (tipo) => {
                                let tipoPeca: TipoPeca;
                                switch (tipo) {
                                    case '1':
                                        tipoPeca = TipoPeca.NACIONAL;
                                        break;
                                    case '2':
                                        tipoPeca = TipoPeca.IMPORTADA;
                                        break;
                                    default:
                                        console.log("Tipo inválido.");
                                        setTimeout(() => onVoltar(), 1000);
                                        return;
                                }
                                peca.setTipo = tipoPeca;
                                console.log("Tipo atualizado com sucesso.");
                                setTimeout(() => onVoltar(), 1000);
                            });
                            break;
                        case '3':
                            this.leitor.question("Novo fornecedor: ", (novoFornecedor) => {
                                peca.setFornecedor = novoFornecedor;
                                console.log("Fornecedor atualizado com sucesso.");
                                setTimeout(() => onVoltar(), 1000);
                            });
                            break;
                        case '4':
                            console.log("Status disponíveis:");
                            console.log("[1] Em Produção");
                            console.log("[2] Em Transporte");
                            console.log("[3] Pronta");
                            console.log("-------------------------");
                            this.leitor.question("Digite o novo status: ", (status) => {
                                let statusPeca: StatusPeca;
                                switch (status) {
                                    case '1':
                                        statusPeca = StatusPeca.EM_PRODUCAO;
                                        break;
                                    case '2':
                                        statusPeca = StatusPeca.EM_TRANSPORTE;
                                        break;
                                    case '3':
                                        statusPeca = StatusPeca.PRONTA;
                                        break;
                                    default:
                                        console.log("Status inválido.");
                                        setTimeout(() => onVoltar(), 1000);
                                        return;
                                }
                                peca.setStatus = statusPeca;
                                console.log("Status atualizado com sucesso.");
                                setTimeout(() => onVoltar(), 1000);
                            });
                            break;
                        case '0':
                            onVoltar();
                            break;
                        default:
                            console.log("Opção inválida. Tente novamente.");
                            setTimeout(() => onVoltar(), 1000);
                    }
                });
            } else {
                console.log("Peça não encontrada.");
                setTimeout(() => onVoltar(), 1000);
            }
        });
    }

    private adicionarPeca(aeronave: Aeronave, onVoltar: () => void): void {
        this.leitor.question("Digite o código da nova peça (apenas números): ", (codigo) => {
            if (!this.validarCodigoPeca(codigo)) {
                console.log("Código inválido. Use apenas números.");
                setTimeout(() => onVoltar(), 1000);
                return;
            }
            if (aeronave.getPecas.some(p => p.getCodigo === codigo)) {
                console.log("Já existe uma peça com esse código.");
                setTimeout(() => onVoltar(), 1000);
                return;
            }
            this.leitor.question("Digite o nome da nova peça: ", (nome) => {
                console.log("Tipos disponíveis:");
                console.log("[1] Nacional");
                console.log("[2] Importada");
                console.log("-------------------------");
                this.leitor.question("Digite o tipo da nova peça: ", (tipo) => {
                    let tipoPeca: TipoPeca;
                    switch (tipo) {
                        case '1':
                            tipoPeca = TipoPeca.NACIONAL;
                            break;
                        case '2':
                            tipoPeca = TipoPeca.IMPORTADA;
                            break;
                        default:
                            console.log("Tipo inválido. Peça não adicionada.");
                            setTimeout(() => onVoltar(), 1000);
                            return;
                    }
                    this.leitor.question("Digite o fornecedor da nova peça: ", (fornecedor) => {
                        console .log("Status disponíveis:");
                        console.log("[1] Em Produção");
                        console.log("[2] Em Transporte");
                        console.log("[3] Pronta");
                        console.log("-------------------------");
                        this.leitor.question("Digite o status da nova peça: ", (status) => {
                            let statusPeca: StatusPeca;
                            switch (status) {
                                case '1':
                                    statusPeca = StatusPeca.EM_PRODUCAO;
                                    break;
                                case '2':
                                    statusPeca = StatusPeca.EM_TRANSPORTE;
                                    break;
                                case '3':
                                    statusPeca = StatusPeca.PRONTA;
                                    break;
                                default:
                                    console.log("Status inválido. Peça não adicionada.");
                                    setTimeout(() => onVoltar(), 1000);
                                    return;
                            }
                            const novaPeca = new Peca(codigo, nome, tipoPeca, fornecedor, statusPeca);
                            aeronave.getPecas.push(novaPeca);
                            console.log("Peça adicionada com sucesso.");
                            setTimeout(() => onVoltar(), 1000);
                        });
                    });
                });
            });
        });
    }

    private listarPecas(aeronave: Aeronave, onVoltar: () => void): void {
        const pecas = aeronave.getPecas;
        console.log(`\n--- Peças da Aeronave ${aeronave.getModelo} ---`);
        if (pecas.length === 0) {
            console.log("Nenhuma peça cadastrada.");
        } else {
            pecas.forEach(peca => {
                console.log(`Código: ${peca.getCodigo}, Nome: ${peca.getNome}, Tipo: ${peca.getTipo}, Fornecedor: ${peca.getFornecedor}, Status: ${peca.getStatus}`);
            });
        }
        console.log("-------------------------");
        this.leitor.question("Pressione Enter para voltar...", () => onVoltar());
    }

    private removerPeca(aeronave: Aeronave, onVoltar: () => void): void {
        this.leitor.question("Digite o código da peça a ser removida: ", (codigo) => {
            if (!this.validarCodigoPeca(codigo)) {
                console.log("Código inválido. O código deve conter apenas números.");
                setTimeout(() => onVoltar(), 1000);
                return;
            }

            const index = aeronave.getPecas.findIndex(p => p.getCodigo === codigo);
            if (index !== -1) {
                aeronave.getPecas.splice(index, 1);
                console.log("Peça removida com sucesso.");
            } else {
                console.log("Peça não encontrada.");
            }
            setTimeout(() => onVoltar(), 1000);
        });
    }
}
