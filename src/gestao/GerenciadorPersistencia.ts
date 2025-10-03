import fs from 'fs';
import path from 'path';
import Aeronave from '../model/Aeronave';
import Funcionario from '../model/Funcionario';
import Peca from '../model/Peca';
import Etapa from '../model/Etapa';
import Teste from '../model/Teste';
import { TipoAeronave, NivelPermissao, TipoPeca, StatusPeca, TipoTeste, ResultadoTeste, StatusEtapa } from '../model/Enums';

export class GerenciadorPersistencia {
    private readonly diretorioDados: string;

    constructor() {
        this.diretorioDados = path.join(__dirname, '../../dados');
        this.garantirDiretorio();
    }

    private garantirDiretorio(): void {
        if (!fs.existsSync(this.diretorioDados)) {
            fs.mkdirSync(this.diretorioDados, { recursive: true });
        }
    }

    // Métodos para Aeronaves
    public salvarAeronaves(aeronaves: Aeronave[]): void {
        const caminhoArquivo = path.join(this.diretorioDados, 'aeronaves.json');
        fs.writeFileSync(caminhoArquivo, JSON.stringify(aeronaves, null, 2));
    }

    public carregarAeronaves(): Aeronave[] {
        const caminhoArquivo = path.join(this.diretorioDados, 'aeronaves.json');
        if (!fs.existsSync(caminhoArquivo)) return [];

        const dados = JSON.parse(fs.readFileSync(caminhoArquivo, 'utf-8'));
        return dados.map((aero: any) => {
            const aeronave = new Aeronave(
                aero.codigo,
                aero.modelo,
                aero.tipo as TipoAeronave,
                aero.capacidade,
                aero.alcance
            );
            
            // Restaurar peças
            if (aero.pecas) {
                const pecas = aero.pecas.map((p: any) => 
                    new Peca(
                        p.codigo,
                        p.nome,
                        p.tipo as TipoPeca,
                        p.fornecedor,
                        p.status as StatusPeca
                    )
                );
                aeronave.getPecas.push(...pecas);
            }

            // Restaurar etapas
            if (aero.etapas) {
                const etapas = aero.etapas.map((e: any) => {
                    const etapa = new Etapa(e.nome, e.prazo);
                    etapa.setStatus = e.status as StatusEtapa;
                    
                    if (e.funcionarios) {
                        const funcionarios = e.funcionarios.map((f: any) =>
                            new Funcionario(
                                f.id,
                                f.nome,
                                f.telefone,
                                f.endereco,
                                f.usuario,
                                f.senha,
                                f.nivelPermissao as NivelPermissao
                            )
                        );
                        etapa.setFuncionarios = funcionarios;
                    }
                    return etapa;
                });
                aeronave.getEtapas.push(...etapas);
            }

            // Restaurar testes
            if (aero.testes) {
                const testes = aero.testes.map((t: any) => {
                    const teste = new Teste(t.tipo as TipoTeste);
                    teste.setResultado = t.resultado as ResultadoTeste;
                    return teste;
                });
                aeronave.getTestes.push(...testes);
            }

            return aeronave;
        });
    }

    // Métodos para Funcionários
    public salvarFuncionarios(funcionarios: Funcionario[]): void {
        const caminhoArquivo = path.join(this.diretorioDados, 'funcionarios.json');
        fs.writeFileSync(caminhoArquivo, JSON.stringify(funcionarios, null, 2));
    }

    public carregarFuncionarios(): Funcionario[] {
        const caminhoArquivo = path.join(this.diretorioDados, 'funcionarios.json');
        if (!fs.existsSync(caminhoArquivo)) return [];

        const dados = JSON.parse(fs.readFileSync(caminhoArquivo, 'utf-8'));
        return dados.map((f: any) => 
            new Funcionario(
                f.id,
                f.nome,
                f.telefone,
                f.endereco,
                f.usuario,
                f.senha,
                f.nivelPermissao as NivelPermissao
            )
        );
    }

    // Método para salvar todo o estado do sistema
    public salvarEstadoSistema(
        aeronaves: Aeronave[],
        funcionarios: Funcionario[]
    ): void {
        this.salvarAeronaves(aeronaves);
        this.salvarFuncionarios(funcionarios);
    }

    // Método para carregar todo o estado do sistema
    public carregarEstadoSistema(): {
        aeronaves: Aeronave[],
        funcionarios: Funcionario[]
    } {
        return {
            aeronaves: this.carregarAeronaves(),
            funcionarios: this.carregarFuncionarios()
        };
    }
}