import * as readline from 'readline';
import Aeronave from "../model/Aeronave";
import { TipoAeronave } from "../model/Enums";
import Funcionario from "../model/Funcionario";
import GerenciadorPeca from "./GerenciadorPeca";
import GerenciadorTeste from "./GerenciadorTeste";
import GerenciadorEtapa from "./GerenciadorEtapa";


export default class GerenciadorAeronave {
    private leitor: readline.Interface;

    private gerenciadorPeca: GerenciadorPeca;
    private gerenciadorTeste: GerenciadorTeste;
    private gerenciadorEtapa: GerenciadorEtapa;
    private usuarioLogado: Funcionario;
    private funcionarios: Funcionario[];

    constructor(leitor: readline.Interface, usuarioLogado: Funcionario, funcionarios: Funcionario[]) {
        this.leitor = leitor;
        this.usuarioLogado = usuarioLogado;
        this.funcionarios = funcionarios;
        this.gerenciadorPeca = new GerenciadorPeca(this.leitor);
        this.gerenciadorTeste = new GerenciadorTeste(this.leitor);
        this.gerenciadorEtapa = new GerenciadorEtapa(this.leitor);
    }

    public gerenciar(aeronave: Aeronave, usuarioLogado: Funcionario, onVoltar: () => void): void {
        console.log("\nMenu de Gerenciamento:");
        console.log("[1] Editar Aeronave");
        console.log("[2] Gerenciar Peças");
        console.log(`[3] Gerenciar Etapas`);
        console.log(`[4] Gerenciar Testes`);
        console.log("[5] Gerar Relatório");
        console.log("[0] Voltar");
        console.log("-------------------------");

        this.leitor.question("Escolha uma opção: ", (opcao) => {
            switch (opcao) {
                case '1':
                    this.editarAeronave(aeronave, onVoltar);
                    break;
                case '2':
                    this.gerenciadorPeca.gerenciar(aeronave, () => this.gerenciar(aeronave, this.usuarioLogado, onVoltar));
                    break;
                case '3':
                    this.gerenciadorEtapa.gerenciar(aeronave, this.usuarioLogado, this.funcionarios, () => this.gerenciar(aeronave, this.usuarioLogado, onVoltar));
                    break;
                case '4':
                    this.gerenciadorTeste.gerenciar(aeronave, () => this.gerenciar(aeronave, this.usuarioLogado, onVoltar));
                    break;
                case '5':
                    this.gerarRelatorio(aeronave, () => this.gerenciar(aeronave, this.usuarioLogado, onVoltar));
                    break;
                case '0':
                    onVoltar();
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.gerenciar(aeronave, this.usuarioLogado, onVoltar);
            }
        });
    }

    private editarAeronave(aeronave: Aeronave, onVoltar: () => void): void {
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
                        this.editarAeronave(aeronave, onVoltar);
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
                        this.editarAeronave(aeronave, onVoltar);
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
                        this.editarAeronave(aeronave, onVoltar);
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
                        this.editarAeronave(aeronave, onVoltar);
                    });
                    break;
                case '0':
                    this.gerenciar(aeronave, this.usuarioLogado, onVoltar);
                    break;
                default:
                    console.log("Opção inválida. Tente novamente.");
                    this.editarAeronave(aeronave, onVoltar);
            }
        });
    }

    private gerarRelatorio(aeronave: Aeronave, onVoltar: () => void): void {
        const data = new Date();
        const dataFormatada = data.toLocaleString('pt-BR').replace(/[\/\s:]/g, '_').replace(/,/g, '');
        const nomeArquivo = `relatorio_${aeronave.getModelo}_${dataFormatada}.txt`;
        const caminho = `./relatorios/${nomeArquivo}`;

        // Cria o diretório se não existir
        const fs = require('fs');
        if (!fs.existsSync('./relatorios')) {
            fs.mkdirSync('./relatorios');
        }

        // Gera o conteúdo do relatório no mesmo formato do método detalhes
        let conteudo = ' \n';
        conteudo += `===== Relatório de Aeronave: ${aeronave.getModelo} =====\n`;
        conteudo += '--- Detalhes da Aeronave ---\n';
        conteudo += `Código: ${aeronave.getCodigo}\n`;
        conteudo += `Modelo: ${aeronave.getModelo}\n`;
        conteudo += `Tipo: ${aeronave.getTipo}\n`;
        conteudo += `Capacidade: ${aeronave.getCapacidade} passageiros\n`;
        conteudo += `Alcance: ${aeronave.getAlcance} km\n`;
        conteudo += '---------------------------\n';

        conteudo += `--- Peças Associadas: ${aeronave.getPecas.length} ---\n`;
        if (aeronave.getPecas.length === 0) {
            conteudo += 'Nenhuma peça cadastrada.\n';
        } else {
            aeronave.getPecas.forEach(peca => {
                conteudo += `Peça: ${peca.getNome}, Tipo: ${peca.getTipo}, Status: ${peca.getStatus}\n`;
            });
        }
        conteudo += '---------------------------\n';

        conteudo += `--- Etapas Associadas: ${aeronave.getEtapas.length} ---\n`;
        if (aeronave.getEtapas.length === 0) {
            conteudo += 'Nenhuma etapa cadastrada.\n';
        } else {
            aeronave.getEtapas.forEach(etapa => {
                conteudo += `Etapa: ${etapa.getNome}, Status: ${etapa.getStatus}, Prazo: ${etapa.getPrazo}\n`;
            });
        }
        conteudo += '---------------------------\n';

        conteudo += `--- Testes Associados: ${aeronave.getTestes.length} ---\n`;
        if (aeronave.getTestes.length === 0) {
            conteudo += 'Nenhum teste cadastrado.\n';
        } else {
            aeronave.getTestes.forEach(teste => {
                conteudo += `Teste: ${teste.getTipo}, Resultado: ${teste.getResultado}\n`;
            });
        }
        conteudo += '---------------------------\n';
        conteudo += ' \n';

        // Salva o relatório em arquivo
        fs.writeFileSync(caminho, conteudo);
        
        console.log(`\nRelatório gerado com sucesso em: ${caminho}`);
        this.leitor.question("\nPressione Enter para voltar...", onVoltar);
    }
}
