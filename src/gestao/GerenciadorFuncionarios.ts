import Funcionario from '../model/Funcionario';
import { NivelPermissao } from '../model/Enums';
import * as readline from 'readline';

export default class GerenciadorFuncionarios {
    private leitor: readline.Interface;
    private onDadosModificados: () => void;

    constructor(leitor: readline.Interface, onDadosModificados: () => void) {
        this.leitor = leitor;
        this.onDadosModificados = onDadosModificados;
    }

    public gerenciar(funcionarios: Funcionario[], onVoltar: () => void): void {
        console.log("\nGerenciar Funcionários:");
        console.log("[1] Adicionar Funcionário");
        console.log("[2] Listar Funcionários");
        console.log("[3] Editar Funcionário");
        console.log("[4] Remover Funcionário");
        console.log("[0] Voltar");
        console.log("-------------------------");
        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarFuncionario(funcionarios, () => this.gerenciar(funcionarios, onVoltar));
                    break;
                case '2':
                    this.listarFuncionarios(funcionarios, () => this.gerenciar(funcionarios, onVoltar));
                    break;
                case '3':
                    this.editarFuncionario(funcionarios, () => this.gerenciar(funcionarios, onVoltar));
                    break;
                case '4':
                    this.removerFuncionario(funcionarios, () => this.gerenciar(funcionarios, onVoltar));
                    break;
                case '0':
                    onVoltar();
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.gerenciar(funcionarios, onVoltar);
            }
        });
    }

    private adicionarFuncionario(funcionarios: Funcionario[], onVoltar: () => void): void {
        this.leitor.question("Nome: ", (nome) => {
            this.leitor.question("Telefone: ", (telefone) => {
                this.leitor.question("Endereço: ", (endereco) => {
                    this.leitor.question("Usuário: ", (usuario) => {
                        if (funcionarios.some(f => f.getUsuario === usuario)) {
                            console.log("Usuário já existente. Tente outro.");
                            setTimeout(onVoltar, 800);
                            return;
                        }
                        this.leitor.question("Senha: ", (senha) => {
                            console.log("Nível de Permissão:");
                            console.log("[1] Administrador");
                            console.log("[2] Engenheiro");
                            console.log("[3] Operador");
                            this.leitor.question("Escolha: ", (nivel) => {
                                let permissao: NivelPermissao;
                                switch (nivel) {
                                    case '1':
                                        permissao = NivelPermissao.ADMINISTRADOR;
                                        break;
                                    case '2':
                                        permissao = NivelPermissao.ENGENHEIRO;
                                        break;
                                    case '3':
                                        permissao = NivelPermissao.OPERADOR;
                                        break;
                                    default:
                                        console.log("Nível de permissão inválido.");
                                        setTimeout(onVoltar, 800);
                                        return;
                                }
                                
                                const maiorId = Math.max(...funcionarios.map(f => parseInt(f.getId)), 0);
                                const novoFuncionario = new Funcionario(
                                    (maiorId + 1).toString(),
                                    nome.trim(),
                                    telefone.trim(),
                                    endereco.trim(),
                                    usuario.trim(),
                                    senha,
                                    permissao
                                );
                                funcionarios.push(novoFuncionario);
                                this.onDadosModificados();
                                console.log(`Funcionário ${nome} adicionado com sucesso!`);
                                setTimeout(onVoltar, 800);
                            });
                        });
                    });
                });
            });
        });
    }

    private listarFuncionarios(funcionarios: Funcionario[], onVoltar: () => void): void {
        console.log("\nLista de Funcionários:");
        if (funcionarios.length === 0) {
            console.log("Nenhum funcionário cadastrado.");
        } else {
            funcionarios.forEach((funcionario) => {
                console.log(`ID: ${funcionario.getId}, Nome: ${funcionario.getNome}, Telefone: ${funcionario.getTelefone}, Endereço: ${funcionario.getEndereco}, Usuário: ${funcionario.getUsuario}, Nível: ${funcionario.getNivelPermissao}`);
            });
        }
        this.leitor.question("\nPressione Enter para voltar...", () => onVoltar());
    }

    private editarFuncionario(funcionarios: Funcionario[], onVoltar: () => void): void {
        if (funcionarios.length === 0) {
            console.log("Nenhum funcionário para editar.");
            setTimeout(onVoltar, 800);
            return;
        }
        this.leitor.question("Digite o ID do funcionário a editar: ", (id) => {
            const func = funcionarios.find(f => f.getId === id);
            if (!func) {
                console.log("Funcionário não encontrado.");
                setTimeout(onVoltar, 800);
                return;
            }
            console.log(`\nEditando ${func.getNome}`);
            console.log("[1] Nome");
            console.log("[2] Telefone");
            console.log("[3] Endereço");
            console.log("[4] Usuário");
            console.log("[5] Senha");
            console.log("[6] Nível de Permissão");
            console.log("[0] Voltar");
            this.leitor.question("Escolha: ", (op) => {
                switch (op) {
                    case '1':
                        this.leitor.question("Novo nome: ", (v) => { func.setNome = v; console.log("Atualizado."); setTimeout(onVoltar, 800); });
                        break;
                    case '2':
                        this.leitor.question("Novo telefone: ", (v) => { func.setTelefone = v; console.log("Atualizado."); setTimeout(onVoltar, 800); });
                        break;
                    case '3':
                        this.leitor.question("Novo endereço: ", (v) => { func.setEndereco = v; console.log("Atualizado."); setTimeout(onVoltar, 800); });
                        break;
                    case '4':
                        this.leitor.question("Novo usuário: ", (v) => {
                            if (funcionarios.some(f => f.getUsuario === v && f.getId !== func.getId)) {
                                console.log("Usuário já existe.");
                                setTimeout(onVoltar, 800);
                            } else { func.setUsuario = v; console.log("Atualizado."); setTimeout(onVoltar, 800); }
                        });
                        break;
                    case '5':
                        this.leitor.question("Nova senha: ", (v) => { func.setSenha = v; console.log("Atualizado."); setTimeout(onVoltar, 800); });
                        break;
                    case '6':
                        console.log("[1] Administrador | [2] Engenheiro | [3] Operador");
                        this.leitor.question("Escolha: ", (nivel) => {
                            let p: NivelPermissao | null = null;
                            if (nivel === '1') p = NivelPermissao.ADMINISTRADOR;
                            if (nivel === '2') p = NivelPermissao.ENGENHEIRO;
                            if (nivel === '3') p = NivelPermissao.OPERADOR;
                            if (!p) { console.log("Opção inválida."); setTimeout(onVoltar, 800); return; }
                            func.setNivelPermissao = p; console.log("Atualizado."); setTimeout(onVoltar, 800);
                        });
                        break;
                    case '0':
                        onVoltar();
                        break;
                    default:
                        console.log("Opção inválida.");
                        setTimeout(onVoltar, 800);
                }
            });
        });
    }

    private removerFuncionario(funcionarios: Funcionario[], onVoltar: () => void): void {
        if (funcionarios.length === 0) {
            console.log("Nenhum funcionário para remover.");
            setTimeout(onVoltar, 800);
            return;
        }
        this.leitor.question("Digite o ID do funcionário a remover: ", (id) => {
            const idx = funcionarios.findIndex(f => f.getId === id);
            if (idx === -1) {
                console.log("Funcionário não encontrado.");
                setTimeout(onVoltar, 800);
                return;
            }
            const removido = funcionarios[idx];
            funcionarios.splice(idx, 1);
            this.onDadosModificados();
            console.log(`Funcionário ${removido.getNome} removido.`);
            setTimeout(onVoltar, 800);
        });
    }
}