import Colisao from "./colisao.js";
class Inimigo {
    constructor(tela, raioMundo) {
        this.tela = tela;
        this.raioMundo = raioMundo;
        this.raio = 15 
        this.raioColisao = this.raio -5;
        this.velocidade = 2; 
        this.positionX = 0; // Posição inicial fora da tela (esquerda)
        this.positionY = 0; // Posição inicial fora da tela (cima)
        this.direcaoX = 0; // Direção inicial (será definida no método iniciar)
        this.direcaoY = 0; // Direção inicial (será definida no método iniciar)
        this.iniciar();
        this.colisao = new Colisao(this.raioColisao, 'rgba(255, 166, 0, 0.5)',this.posicaoX,this.posicaoY);
    }

    iniciar() {
        // Definir posição inicial fora da tela (esquerda ou direita) e direção para mover em direção ao mundo
        if (Math.random() < 0.5) {
            // Spawn à esquerda
            this.positionX = -this.raioColisao;
            this.positionY = Math.random() * this.tela.height; // Posição vertical aleatória
            this.direcaoX = 1; // Mover para a direita
            this.direcaoY = (this.raioMundo - this.positionY) / this.tela.height; // Mover em direção ao centro do mundo
        } else {
            // Spawn à direita
            this.positionX = this.tela.width + this.raioColisao;
            this.positionY = Math.random() * this.tela.height; // Posição vertical aleatória
            this.direcaoX = -1; // Mover para a esquerda
            this.direcaoY = (this.raioMundo - this.positionY) / this.tela.height; // Mover em direção ao centro do mundo
        }
    }

    atualizar() {
        // Movimentar em direção ao centro do mundo
        this.positionX += this.direcaoX * this.velocidade;
        this.positionY += this.direcaoY * this.velocidade;
        this.colisao.atualizarColisao(this.positionX,this.positionY);
    }

    desenhar(contexto, debug) {
        contexto.beginPath();
        contexto.arc(this.positionX, this.positionY, this.raio, 0, Math.PI * 2);
        contexto.fillStyle = 'green'; // Cor do inimigo (ajuste conforme necessário)
        contexto.fill();
        this.colisao.desenharColisao(debug,contexto);

    }
}
export default Inimigo;

