import Colisao from "./colisao.js"
class Mundo {

        constructor(tela, debug) {
            this.raio = 150;
            this.posicaoX = tela.width / 2;
            this.posicaoY = tela.height / 2;
            this.raioColisao = this.raio - 5;
            this.debug = debug;
        }


        atualizarPosicao(tela) {
            this.posicaoX = tela.width / 2;
            this.posicaoY = tela.height / 2;
            this.raioColisao = this.raio - 5;
        }

        
    desenhar(contexto) {
        // Desenhar o mundo (círculo)
        contexto.beginPath();
        contexto.arc(this.posicaoX, this.posicaoY, this.raio, 0, Math.PI * 2);
        contexto.fillStyle = 'blue';
        contexto.fill();
        const colisao = new Colisao(this.raioColisao, 'rgba(255,0,0,0.29)',this.posicaoX,this.posicaoY);
        colisao.desenharColisao(this.debug, contexto);
    }
}
export default Mundo;
