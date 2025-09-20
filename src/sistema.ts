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

        console.log("\nMenu Principal:");
        console.log("[1] Gerenciar Aeronaves");
        console.log("[2] Gerenciar Funcionários");
        console.log("[3] Gerenciar Etapas");
        console.log("[4] Gerenciar Peças");
        console.log("[5] Gerenciar Testes");
        console.log("[0] Logout");
        console.log("-------------------------");
    }
}