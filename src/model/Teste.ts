import { TipoTeste, ResultadoTeste } from "./Enums";

export default class Teste {
    private tipo: TipoTeste;
    private resultado: ResultadoTeste;

    constructor(tipo: TipoTeste) {
        this.tipo = tipo;
        this.resultado = ResultadoTeste.NAO_REALIZADO;
    }

    // Getters
    get getTipo(): TipoTeste {
        return this.tipo;
    }

    get getResultado(): ResultadoTeste {
        return this.resultado;
    }

    // Setters
    set setTipo(tipo: TipoTeste) {
        this.tipo = tipo;
    }

    set setResultado(resultado: ResultadoTeste) {
        this.resultado = resultado;
    }

    public realizarTeste(resultado: ResultadoTeste): void { 
        console.log(`Teste do tipo ${this.tipo}. Resultado alterado para: ${resultado}`);
        this.resultado = resultado;
    }
}
