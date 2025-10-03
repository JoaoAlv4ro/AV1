import Aeronave from "./model/Aeronave";
import { NivelPermissao, TipoAeronave } from "./model/Enums";
import Funcionario from "./model/Funcionario";

import * as readline from 'readline';

import GerenciadorAeronave from "./gestao/GerenciadorAeronave";
import GerenciadorFuncionarios from "./gestao/GerenciadorFuncionarios";
import { GerenciadorPersistencia } from "./gestao/GerenciadorPersistencia";


export default class AerocodeSystem {
    private leitor: readline.Interface;

    private aeronaves: Aeronave[] = [];
    private funcionarios: Funcionario[] = [];

    private usuarioLogado: Funcionario | null = null;

    private gerenciadorAeronave: GerenciadorAeronave | null = null;
    private gerenciadorFuncionarios: GerenciadorFuncionarios;
    private gerenciadorPersistencia: GerenciadorPersistencia;

    constructor() {
        this.leitor = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.gerenciadorPersistencia = new GerenciadorPersistencia();
        this.gerenciadorFuncionarios = new GerenciadorFuncionarios(
            this.leitor,
            () => this.salvarDados()
        );
        this.carregarDados();
    }

    private carregarDados(): void {
        const dados = this.gerenciadorPersistencia.carregarEstadoSistema();
        this.aeronaves = dados.aeronaves;
        this.funcionarios = dados.funcionarios;
    }

    private salvarDados(): void {
        this.gerenciadorPersistencia.salvarEstadoSistema(
            this.aeronaves,
            this.funcionarios
        );
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
        this.salvarDados();
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
                    this.gerenciadorAeronave = new GerenciadorAeronave(this.leitor, funcionario, this.funcionarios);
                    console.log(`Login bem-sucedido! Bem-vindo, ${this.usuarioLogado.getNome}.`);
                    setTimeout(() => this.mostrarMenuPrincipal(), 1000);
                } else {
                    console.log("Nome de usuário ou senha incorretos. Tente novamente.");
                    setTimeout(() => this.mostrarMenuAcesso(), 1000);
                }
            });
        });
    }

    private mostrarMenuPrincipal(): void {
        if (!this.usuarioLogado) {
            this.mostrarMenuAcesso();
            return;
        }

        console.log();
        console.log(`Usuario logado: ${this.usuarioLogado.getNome} (Tipo: ${this.usuarioLogado.getNivelPermissao})`);
        console.log("---- Menu Principal: ----");
        console.log("[1] Gerenciar Aeronave");
        console.log("[2] Adicionar Aeronave");
        console.log("[3] Listar Aeronaves");
        console.log("[4] Remover Aeronave");
        console.log("[5] Gerenciar Funcionários (Admin)");
        console.log("[0] Logout");
        console.log("-------------------------");
        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.gerenciarAeronaves();
                    break;
                case '2':
                    if (this.usuarioLogado?.getNivelPermissao === NivelPermissao.ADMINISTRADOR) {
                        this.adicionarAeronave();
                    } else {
                        console.log("Acesso negado. Apenas administradores podem adicionar aeronaves.");
                        setTimeout(() => this.mostrarMenuPrincipal(), 1000);
                    }
                    break;
                case '3':
                    this.listarAeronaves();
                    break;
                case '4':
                    if (this.usuarioLogado?.getNivelPermissao === NivelPermissao.ADMINISTRADOR) {
                        this.leitor.question("Digite o código da aeronave a ser removida: ", (codigo) => {
                            this.removerAeronave(codigo);
                            setTimeout(() => this.mostrarMenuPrincipal(), 1000);
                        });
                    } else {
                        console.log("Acesso negado. Apenas administradores podem remover aeronaves.");
                        setTimeout(() => this.mostrarMenuPrincipal(), 1000);
                    }
                    break;
                case '5':
                    if (this.usuarioLogado?.getNivelPermissao === NivelPermissao.ADMINISTRADOR) {
                        this.gerenciadorFuncionarios.gerenciar(this.funcionarios, () => this.mostrarMenuPrincipal());
                    } else {
                        console.log("Acesso negado. Apenas administradores podem gerenciar funcionários.");
                        setTimeout(() => this.mostrarMenuPrincipal(), 1000);
                    }
                    break;
                case '0':
                    this.usuarioLogado = null;
                    this.gerenciadorAeronave = null;
                    console.log("Logout realizado com sucesso.");
                    setTimeout(() => this.mostrarMenuAcesso(), 1000);
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.mostrarMenuPrincipal();
            }
        });
    }

    private gerenciarAeronaves(): void {
        if (this.aeronaves.length === 0) {
            console.log("Nenhuma aeronave cadastrada para gerenciar.");
            setTimeout(() => this.mostrarMenuPrincipal(), 1000);
            return;
        }

        console.log("\n--- Aeronaves Disponíveis ---");
        this.aeronaves.forEach(aeronave => {
            console.log(`Código: ${aeronave.getCodigo}, Modelo: ${aeronave.getModelo}`);
        });
        console.log("-------------------------");

        this.leitor.question("Digite o código da aeronave: ", (codigo) => {
            const aeronave = this.aeronaves.find(a => a.getCodigo === codigo);
            if (aeronave) {
                console.log(`Gerenciando aeronave: ${aeronave.getModelo}`);
                if (this.usuarioLogado && this.gerenciadorAeronave) {
                    this.gerenciadorAeronave.gerenciar(aeronave, this.usuarioLogado, () => {
                        this.mostrarMenuPrincipal();
                    });
                } else {
                    console.log("Erro: Usuário não está logado ou gerenciador não inicializado");
                    setTimeout(() => this.mostrarMenuPrincipal(), 1000);
                }
            } else {
                console.log("Aeronave não encontrada.");
                setTimeout(() => this.mostrarMenuPrincipal(), 1000);
            }
        });
    }
    
    private adicionarAeronave(): void {
        this.leitor.question("Digite o modelo da aeronave: ", (modelo) => {
            this.leitor.question("Digite o tipo da aeronave ([1]Comercial, [2]Militar): ", (tipo) => {
                let tipoAeronave: TipoAeronave = TipoAeronave.COMERCIAL;
                if (tipo !== '1' && tipo !== '2') {
                    console.log("Tipo inválido. Tente novamente.");
                    setTimeout(() => this.mostrarMenuPrincipal(), 1000);
                    return;
                } else {
                    switch (tipo) {
                        case "1":
                            tipoAeronave = TipoAeronave.COMERCIAL;
                            break;
                        case "2":
                            tipoAeronave = TipoAeronave.MILITAR;
                            break;
                    }
                }
                this.leitor.question("Digite a capacidade da aeronave: ", (capacidade) => {
                    this.leitor.question("Digite o alcance da aeronave: ", (alcance) => {
                        const novaAeronave = new Aeronave(
                            (this.aeronaves.length + 1).toString(),
                            modelo,
                            tipoAeronave,
                            parseInt(capacidade),
                            parseInt(alcance)
                        );
                        this.aeronaves.push(novaAeronave);
                        this.salvarDados();
                        console.log(`Aeronave ${modelo} adicionada com sucesso!`);
                        setTimeout(() => this.mostrarMenuPrincipal(), 1000);
                    });
                });
            });
        });
    }

    private listarAeronaves(): void {
        console.clear();
        console.log("\n----- Lista de Aeronaves: -----");
        if (this.aeronaves.length === 0) {
            console.log("Nenhuma aeronave cadastrada.");
        } else {
            this.aeronaves.forEach((aeronave) => {
                aeronave.detalhes();
            });
        }
        this.leitor.question("\nPressione Enter para voltar ao menu principal...", () => {
            this.mostrarMenuPrincipal();
        });
    }

    private removerAeronave(codigo: string): void {
        const index = this.aeronaves.findIndex(a => a.getCodigo === codigo);
        if (index !== -1) {
            this.aeronaves.splice(index, 1);
            this.salvarDados();
            console.log(`Aeronave com código ${codigo} removida com sucesso!`);
        } else {
            console.log("Aeronave não encontrada.");
            setTimeout(() => this.mostrarMenuPrincipal(), 1000);
        }
    }
}