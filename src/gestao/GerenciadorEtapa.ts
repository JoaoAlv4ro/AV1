import * as readline from 'readline';
import Aeronave from "../model/Aeronave";
import Etapa from "../model/Etapa";
import Funcionario from "../model/Funcionario";
import { StatusEtapa, NivelPermissao } from "../model/Enums";

export default class GerenciadorEtapa {
    private leitor: readline.Interface;

    constructor(leitor: readline.Interface) {
        this.leitor = leitor;
    }

    public gerenciar(aeronave: Aeronave, usuarioLogado: Funcionario, funcionarios: Funcionario[], onVoltar: () => void): void {
        console.log("\nMenu de Gerenciamento de Etapas:");
        console.log("[1] Listar Etapas");
        console.log("[2] Adicionar Etapa");
        console.log("[3] Iniciar/Finalizar Etapa");
        console.log("[4] Editar Etapa");
        console.log("[5] Gerenciar Funcionários da Etapa");
        console.log("[6] Remover Etapa");
        console.log("[0] Voltar");
        console.log("-------------------------");

        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.listarEtapas(aeronave, () => this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar));
                    break;
                case '2':
                    if (this.podeGerenciarEtapas(usuarioLogado)) {
                        this.adicionarEtapa(aeronave, () => this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar));
                    } else {
                        console.log("Acesso negado. Apenas Engenheiros e Administradores podem adicionar etapas.");
                        setTimeout(() => this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar), 1000);
                    }
                    break;
                case '3':
                    if (this.podeGerenciarEtapas(usuarioLogado)) {
                        this.gerenciarStatusEtapa(aeronave, () => this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar));
                    } else {
                        console.log("Acesso negado. Apenas Engenheiros e Administradores podem alterar status de etapas.");
                        setTimeout(() => this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar), 1000);
                    }
                    break;
                case '4':
                    if (this.podeGerenciarEtapas(usuarioLogado)) {
                        this.editarEtapa(aeronave, () => this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar));
                    } else {
                        console.log("Acesso negado. Apenas Engenheiros e Administradores podem editar etapas.");
                        setTimeout(() => this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar), 1000);
                    }
                    break;
                case '5':
                    this.gerenciarFuncionariosEtapa(aeronave, funcionarios, () => this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar));
                    break;
                case '6':
                    if (usuarioLogado.getNivelPermissao === NivelPermissao.ADMINISTRADOR) {
                        this.removerEtapa(aeronave, () => this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar));
                    } else {
                        console.log("Acesso negado. Apenas Administradores podem remover etapas.");
                        setTimeout(() => this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar), 1000);
                    }
                    break;
                case '0':
                    onVoltar();
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.gerenciar(aeronave, usuarioLogado, funcionarios, onVoltar);
            }
        });
    }

    private podeGerenciarEtapas(usuario: Funcionario): boolean {
        return usuario.getNivelPermissao === NivelPermissao.ADMINISTRADOR || usuario.getNivelPermissao === NivelPermissao.ENGENHEIRO;
    }

    private listarEtapas(aeronave: Aeronave, onVoltar: () => void): void {
        console.log(`\n--- Etapas da Aeronave ${aeronave.getModelo} ---`);
        if (aeronave.getEtapas.length === 0) {
            console.log("Nenhuma etapa cadastrada.");
        } else {
            aeronave.getEtapas.forEach((etapa, index) => {
                console.log(`\n[${index + 1}] ${etapa.getNome}`);
                console.log(`Status: ${etapa.getStatus}`);
                console.log(`Prazo: ${etapa.getPrazo}`);
                console.log(`Funcionários: ${etapa.getFuncionarios.length}`);
            });
        }
        console.log("-------------------------");
        this.leitor.question("\nPressione Enter para voltar...", () => onVoltar());
    }

    private adicionarEtapa(aeronave: Aeronave, onVoltar: () => void): void {
        this.leitor.question("Nome da etapa: ", (nome) => {
            if (!nome.trim()) {
                console.log("Nome da etapa não pode ser vazio.");
                setTimeout(onVoltar, 1000);
                return;
            }

            this.leitor.question("Prazo (formato DD/MM/YYYY): ", (prazo) => {
                if (!/^\d{2}\/\d{2}\/\d{4}$/.test(prazo)) {
                    console.log("Formato de data inválido. Use DD/MM/YYYY");
                    setTimeout(onVoltar, 1000);
                    return;
                }

                const novaEtapa = new Etapa(nome.trim(), prazo);
                aeronave.getEtapas.push(novaEtapa);
                console.log(`Etapa "${nome}" adicionada com sucesso!`);
                setTimeout(onVoltar, 1000);
            });
        });
    }

    private gerenciarStatusEtapa(aeronave: Aeronave, onVoltar: () => void): void {
        if (aeronave.getEtapas.length === 0) {
            console.log("Nenhuma etapa para gerenciar.");
            setTimeout(onVoltar, 1000);
            return;
        }

        console.log("\nEtapas disponíveis:");
        aeronave.getEtapas.forEach((etapa, index) => {
            console.log(`[${index + 1}] ${etapa.getNome} - Status atual: ${etapa.getStatus}`);
        });

        this.leitor.question("\nEscolha o número da etapa: ", (indexStr) => {
            const index = parseInt(indexStr) - 1;
            if (isNaN(index) || index < 0 || index >= aeronave.getEtapas.length) {
                console.log("Etapa inválida.");
                setTimeout(onVoltar, 1000);
                return;
            }

            const etapa = aeronave.getEtapas[index];
            console.log("\nAções disponíveis:");
            console.log("[1] Iniciar Etapa");
            console.log("[2] Finalizar Etapa");
            console.log("[0] Voltar");

            this.leitor.question("Escolha: ", (acao) => {
                switch (acao) {
                    case '1':
                        if (index > 0 && aeronave.getEtapas[index - 1].getStatus !== StatusEtapa.CONCLUIDA) {
                            console.log("Não é possível iniciar esta etapa. A etapa anterior precisa ser concluída primeiro.");
                        } else {
                            etapa.iniciarEtapa();
                        }
                        break;
                    case '2':
                        if (etapa.getStatus !== StatusEtapa.ANDAMENTO) {
                            console.log("Só é possível finalizar etapas que estejam em andamento.");
                        } else {
                            etapa.finalizarEtapa();
                        }
                        break;
                    case '0':
                        break;
                    default:
                        console.log("Opção inválida.");
                }
                setTimeout(onVoltar, 1000);
            });
        });
    }

    private editarEtapa(aeronave: Aeronave, onVoltar: () => void): void {
        if (aeronave.getEtapas.length === 0) {
            console.log("Nenhuma etapa para editar.");
            setTimeout(onVoltar, 1000);
            return;
        }

        console.log("\nEtapas disponíveis:");
        aeronave.getEtapas.forEach((etapa, index) => {
            console.log(`[${index + 1}] ${etapa.getNome}`);
        });

        this.leitor.question("\nEscolha o número da etapa: ", (indexStr) => {
            const index = parseInt(indexStr) - 1;
            if (isNaN(index) || index < 0 || index >= aeronave.getEtapas.length) {
                console.log("Etapa inválida.");
                setTimeout(onVoltar, 1000);
                return;
            }

            const etapa = aeronave.getEtapas[index];
            console.log("\nO que deseja editar?");
            console.log("[1] Nome");
            console.log("[2] Prazo");
            console.log("[0] Voltar");

            this.leitor.question("Escolha: ", (opcao) => {
                switch (opcao) {
                    case '1':
                        this.leitor.question("Novo nome: ", (nome) => {
                            if (!nome.trim()) {
                                console.log("Nome não pode ser vazio.");
                            } else {
                                etapa.setNome = nome.trim();
                                console.log("Nome atualizado com sucesso!");
                            }
                            setTimeout(onVoltar, 1000);
                        });
                        break;
                    case '2':
                        this.leitor.question("Novo prazo (DD/MM/YYYY): ", (prazo) => {
                            if (!/^\d{2}\/\d{2}\/\d{4}$/.test(prazo)) {
                                console.log("Formato de data inválido. Use DD/MM/YYYY");
                            } else {
                                etapa.setPrazo = prazo;
                                console.log("Prazo atualizado com sucesso!");
                            }
                            setTimeout(onVoltar, 1000);
                        });
                        break;
                    case '0':
                    default:
                        onVoltar();
                }
            });
        });
    }

    private gerenciarFuncionariosEtapa(aeronave: Aeronave, funcionarios: Funcionario[], onVoltar: () => void): void {
        if (aeronave.getEtapas.length === 0) {
            console.log("Nenhuma etapa disponível.");
            setTimeout(onVoltar, 1000);
            return;
        }

        console.log("\nEtapas disponíveis:");
        aeronave.getEtapas.forEach((etapa, index) => {
            console.log(`[${index + 1}] ${etapa.getNome} (${etapa.getFuncionarios.length} funcionários)`);
        });

        this.leitor.question("\nEscolha o número da etapa: ", (indexStr) => {
            const index = parseInt(indexStr) - 1;
            if (isNaN(index) || index < 0 || index >= aeronave.getEtapas.length) {
                console.log("Etapa inválida.");
                setTimeout(onVoltar, 1000);
                return;
            }

            const etapa = aeronave.getEtapas[index];
            console.log("\nGerenciar Funcionários:");
            console.log("[1] Listar Funcionários");
            console.log("[2] Associar Funcionário");
            console.log("[3] Remover Funcionário");
            console.log("[0] Voltar");

            this.leitor.question("Escolha: ", (opcao) => {
                switch (opcao) {
                    case '1':
                        etapa.listarFuncionarios();
                        setTimeout(() => this.gerenciarFuncionariosEtapa(aeronave, funcionarios, onVoltar), 1000);
                        break;
                    case '2':
                        if (funcionarios.length === 0) {
                            console.log("Nenhum funcionário disponível no sistema.");
                            setTimeout(() => this.gerenciarFuncionariosEtapa(aeronave, funcionarios, onVoltar), 1000);
                            return;
                        }
                        console.log("\nFuncionários disponíveis:");
                        funcionarios.forEach((func, i) => {
                            console.log(`[${i + 1}] ${func.getNome} (${func.getNivelPermissao})`);
                        });
                        this.leitor.question("Escolha o número do funcionário para associar: ", (indexStr) => {
                            const idx = parseInt(indexStr) - 1;
                            if (isNaN(idx) || idx < 0 || idx >= funcionarios.length) {
                                console.log("Funcionário inválido.");
                                setTimeout(() => this.gerenciarFuncionariosEtapa(aeronave, funcionarios, onVoltar), 1000);
                                return;
                            }
                            const funcionario = funcionarios[idx];
                            if (etapa.getFuncionarios.some(f => f.getId === funcionario.getId)) {
                                console.log("Este funcionário já está associado a esta etapa.");
                            } else {
                                etapa.associarFuncionario(funcionario);
                            }
                            setTimeout(() => this.gerenciarFuncionariosEtapa(aeronave, funcionarios, onVoltar), 1000);
                        });
                        break;
                    case '3':
                        if (etapa.getFuncionarios.length === 0) {
                            console.log("Nenhum funcionário associado a esta etapa.");
                            setTimeout(() => this.gerenciarFuncionariosEtapa(aeronave, funcionarios, onVoltar), 1000);
                            return;
                        }
                        console.log("\nFuncionários da etapa:");
                        etapa.getFuncionarios.forEach((func, i) => {
                            console.log(`[${i + 1}] ${func.getNome}`);
                        });
                        this.leitor.question("Escolha o número do funcionário para remover: ", (funcIndex) => {
                            const idx = parseInt(funcIndex) - 1;
                            if (isNaN(idx) || idx < 0 || idx >= etapa.getFuncionarios.length) {
                                console.log("Funcionário inválido.");
                            } else {
                                const removido = etapa.getFuncionarios[idx];
                                etapa.getFuncionarios.splice(idx, 1);
                                console.log(`Funcionário ${removido.getNome} removido da etapa.`);
                            }
                            setTimeout(() => this.gerenciarFuncionariosEtapa(aeronave, funcionarios, onVoltar), 1000);
                        });
                        break;
                    case '0':
                    default:
                        onVoltar();
                }
            });
        });
    }

    private removerEtapa(aeronave: Aeronave, onVoltar: () => void): void {
        if (aeronave.getEtapas.length === 0) {
            console.log("Nenhuma etapa para remover.");
            setTimeout(onVoltar, 1000);
            return;
        }

        console.log("\nEtapas disponíveis:");
        aeronave.getEtapas.forEach((etapa, index) => {
            console.log(`[${index + 1}] ${etapa.getNome} - ${etapa.getStatus}`);
        });

        this.leitor.question("\nEscolha o número da etapa para remover: ", (indexStr) => {
            const index = parseInt(indexStr) - 1;
            if (isNaN(index) || index < 0 || index >= aeronave.getEtapas.length) {
                console.log("Etapa inválida.");
                setTimeout(onVoltar, 1000);
                return;
            }

            const etapa = aeronave.getEtapas[index];
            this.leitor.question(`Tem certeza que deseja remover a etapa "${etapa.getNome}"? (s/N) `, (confirma) => {
                if (confirma.toLowerCase() === 's') {
                    aeronave.getEtapas.splice(index, 1);
                    console.log("Etapa removida com sucesso!");
                } else {
                    console.log("Operação cancelada.");
                }
                setTimeout(onVoltar, 1000);
            });
        });
    }
}