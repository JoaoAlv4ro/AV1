import { TipoTeste, ResultadoTeste } from "./Enums";

export default class Teste {
    tipo: TipoTeste;
    resultado: ResultadoTeste;

    constructor(tipo: TipoTeste) {
        this.tipo = tipo;
        this.resultado = ResultadoTeste.NAO_REALIZADO;
    }

    public realizarTeste(resultado: ResultadoTeste): void { 
        console.log(`Teste do tipo ${this.tipo}. Resultado alterado para: ${resultado}`);
        this.resultado = resultado;
    }
}
