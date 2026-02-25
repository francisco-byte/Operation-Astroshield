import Colisao from "./colisao.js";
class Nave {
    constructor(tela, raioMundo, debug, contexto) {
        this.angulo = 0;
        this.velocidadeAngular = 0;
        this.maximaVelocidadeAngular = 0.02;
        this.aceleracao = 0.0005;
        this.atrito = 0.99;
        this.aVirarEsquerda = false;
        this.aVirarDireita = false;
        this.tamanho = 20;
        this.altura = 30;
        this.raioColisao = 15;
        this.raioMundo = raioMundo;
        this.posicaoX = tela.width / 2 + raioMundo + this.altura; // Posição inicial ao redor do mundo
        this.posicaoY = tela.height / 2;
        this.tela = tela;
        this.debug = debug;
        this.contexto = contexto;
        this.colisao = new Colisao(this.raioColisao, 'rgba(255, 255, 0, 0.5)',this.posicaoX,this.posicaoY);
    }
    desenhar() {
        this.iniciarEventListeners();
        this.contexto.save();
        this.contexto.translate(this.tela.width / 2, this.tela.height / 2); // Movendo para o centro do canvas
        this.contexto.rotate(this.angulo); // Rotacionando de acordo com o ângulo

        // Movendo para a posição ao redor do mundo
        this.contexto.translate(this.raioMundo + this.altura, 0); // Movendo para a posição na borda do mundo

        // Desenhando a nave
        this.contexto.beginPath();
        this.contexto.moveTo(0, -this.tamanho / 2);
        this.contexto.lineTo(this.altura, 0);
        this.contexto.lineTo(0, this.tamanho / 2);
        this.contexto.closePath();
        this.contexto.fillStyle = 'red';
        this.contexto.fill();


        this.contexto.restore();
        this.colisao.desenharColisao(this.debug, this.contexto);
    }

    atualizar() {
        if (this.aVirarEsquerda) {
            this.velocidadeAngular -= this.aceleracao;
        }

        if (this.aVirarDireita) {
            this.velocidadeAngular += this.aceleracao;
        }

        this.angulo += this.velocidadeAngular;
        this.velocidadeAngular *= this.atrito;
        this.velocidadeAngular = Math.max(Math.min(this.velocidadeAngular, this.maximaVelocidadeAngular), -this.maximaVelocidadeAngular);
        const ColisaoX = this.tela.width / 2 + (this.raioMundo + this.altura) * Math.cos(this.angulo);
        const ColisaoY = this.tela.height / 2 + (this.raioMundo + this.altura) * Math.sin(this.angulo);
        this.colisao.atualizarColisao(ColisaoX, ColisaoY);
    }

    iniciarEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
                this.aVirarEsquerda = true;
            } else if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
                this.aVirarDireita = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
                this.aVirarEsquerda = false;
            } else if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
                this.aVirarDireita = false;
            }
        });
    }


}

export default Nave;
