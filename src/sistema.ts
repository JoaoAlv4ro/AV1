import Aeronave from "./model/Aeronave";
import { NivelPermissao } from "./model/Enums";
import Etapa from "./model/Etapa";
import Funcionario from "./model/Funcionario";
import Peca from "./model/Peca";
import Teste from "./model/Teste";
import * as readline from 'readline';


export default class AerocodeSystem {
    private leitor: readline.Interface;

    private aeronaves: Aeronave[] = [];
    private funcionarios: Funcionario[] = [];
    private etapas: Etapa[] = [];
    private pecas: Peca[] = [];
    private testes: Teste[] = [];

    private usuarioLogado: Funcionario | null = null;

    constructor() {
        this.leitor = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    private criarAdmin(): void {
        if (this.funcionarios.length > 0) return; // Evitar múltiplos admins
        const admin = new Funcionario(
            "0",
            "Admin",
            "0000-0000",
            "Endereço Admin",
            "admin",
            "senha",
            NivelPermissao.ADMINISTRADOR
        );
        this.funcionarios.push(admin);
    }

    public iniciar(): void {
        this.criarAdmin();
        console.log("Bem-vindo ao Sistema Aerocode!");
        console.log("-----------------------------");
        this.mostrarMenuAcesso();
    }

    private mostrarMenuAcesso(): void {
        console.log("\nMenu de Acesso:");
        console.log("[1] Login");
        console.log("[0] Sair");
        console.log("-------------------------");
    
        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.login();
                    break;
                case '0':
                    console.log("Saindo do sistema...");
                    this.leitor.close();
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.mostrarMenuAcesso();
            }
        });
    }

    private login(): void {
        this.leitor.question("Digite o usuário: ", (user) => {
            this.leitor.question("Digite a senha: ", (senha) => {
                const funcionario = this.funcionarios.find(f => f.getUsuario === user);
                if (funcionario?.autenticar(user, senha)) {
                    this.usuarioLogado = funcionario;
                    console.log(`Login bem-sucedido! Bem-vindo, ${this.usuarioLogado.getNome}.`);
                    this.mostrarMenuPrincipal();
                } else {
                    console.log("Nome de usuário ou senha incorretos. Tente novamente.");
                    this.mostrarMenuPrincipal();
                }
            });
        });
    }

    private mostrarMenuPrincipal(): void {
        if (!this.usuarioLogado) {
            this.mostrarMenuAcesso();
            return;
        }

        console.clear();
        console.log(`Usuario logado: ${this.usuarioLogado.getNome} (Tipo: ${this.usuarioLogado.getNivelPermissao})`);
        console.log("\nMenu Principal:");
        console.log("[1] Gerenciar Aeronaves");
        console.log("[2] Gerenciar Funcionários");
        console.log("[3] Gerenciar Etapas");
        console.log("[4] Gerenciar Peças");
        console.log("[5] Gerenciar Testes");
        console.log("[0] Logout");
        console.log("-------------------------");
        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.mostrarMenuPrincipal(); // Gerenciar aeronaves
                    break;
                case '2':
                    if (this.usuarioLogado?.getNivelPermissao === NivelPermissao.ADMINISTRADOR) {
                        this.gerenciarFuncionarios();
                    } else {
                        console.log("Acesso negado. Apenas administradores podem gerenciar funcionários.");
                        this.mostrarMenuPrincipal();
                    }
                    break;
                case '3':
                    this.mostrarMenuPrincipal(); // Gerenciar etapas
                    break;
                case '4':
                    this.mostrarMenuPrincipal(); // Gerenciar peças
                    break;
                case '5':
                    this.mostrarMenuPrincipal(); // Gerenciar testes
                    break;
                case '0':
                    this.usuarioLogado = null;
                    console.log("Logout realizado com sucesso.");
                    this.mostrarMenuAcesso();
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.mostrarMenuPrincipal();
            }
        });
    }

    private gerenciarFuncionarios(): void {
        console.log("\nGerenciar Funcionários:");
        console.log("[1] Adicionar Funcionário");
        console.log("[2] Listar Funcionários");
        console.log("[0] Voltar ao Menu Principal");
        console.log("-------------------------");
        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.adicionarFuncionario();
                    break;
                case '2':
                    this.listarFuncionarios();
                    break;
                case '0':
                    this.mostrarMenuPrincipal();
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.gerenciarFuncionarios();
            }
        });
    }

    private adicionarFuncionario(): void {
        this.leitor.question("Nome: ", (nome) => {
            this.leitor.question("Telefone: ", (telefone) => {
                this.leitor.question("Endereço: ", (endereco) => {
                    this.leitor.question("Usuário: ", (usuario) => {
                        this.leitor.question("Senha: ", (senha) => {
                            this.leitor.question("Nível de Permissão ([1]Administrador, [2]Engenheiro, [3]Operador): ", (nivel) => {
                                let permissao: NivelPermissao = NivelPermissao.OPERADOR;
                                if (![1, 2, 3].includes(parseInt(nivel))) {
                                    console.log("Nível de permissão inválido. Tente novamente.");
                                    this.gerenciarFuncionarios();
                                    return;
                                } else {
                                    switch (nivel) {
                                        case "1":
                                            permissao = NivelPermissao.ADMINISTRADOR;
                                            break;
                                        case "2":
                                            permissao = NivelPermissao.ENGENHEIRO;
                                            break;
                                        case "3":
                                            permissao = NivelPermissao.OPERADOR;
                                            break;
                                    }
                                }
                                const novoFuncionario = new Funcionario(
                                    (this.funcionarios.length + 1).toString(),
                                    nome,
                                    telefone,
                                    endereco,
                                    usuario,
                                    senha,
                                    permissao
                                );
                                this.funcionarios.push(novoFuncionario);
                                console.log(`Funcionário ${nome} adicionado com sucesso!`);
                                this.gerenciarFuncionarios();
                            });
                        });
                    });
                });
            });
        });
    }

    private listarFuncionarios(): void {
        console.clear();
        console.log("\nLista de Funcionários:");
        this.funcionarios.forEach((funcionario) => {
            console.log(`ID: ${funcionario.getId}, Nome: ${funcionario.getNome}, Telefone: ${funcionario.getTelefone}, Endereço: ${funcionario.getEndereco}, Usuário: ${funcionario.getUsuario}, Nível de Permissão: ${funcionario.getNivelPermissao}`);
        });
        this.gerenciarFuncionarios();
    }

}