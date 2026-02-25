import Colisao from "./colisao.js";
import bala from "./balas.js";

class Nave {
    constructor(tela, debug, contexto, audioTiro) {
        this.angulo = 0;
        this.velocidadeAngular = 0;
        this.maximaVelocidadeAngular = 0.02;
        this.aceleracao = 0.0005;
        this.atrito = 0.99;
        this.aVirarEsquerda = false;
        this.aVirarDireita = false;
        this.tamanho = 20;
        this.raioOrbita = 200;
        this.posicaoX = tela.width / 2 + this.raioOrbita; // Posição inicial da nave (centralizada no meio da tela + raio da órbita)
        this.posicaoY = tela.height / 2;
        this.tela = tela;
        this.debug = debug;
        this.contexto = contexto;
        this.podeDisparar = true;
        this.balas = [];
        this.balasNoPente = 5; // Balas no pente
        this.maxBalasNoPente = 5; // Máximo de balas no pente
        this.tempoRegeneracao = 2500; // Tempo de regeneração em milissegundos
        this.iniciarRegeneracaoBalas(); // Inicia a regeneração das balas
        this.audioTiro = audioTiro
        this.volume = 0.03
        this.naveImage = new Image();
        this.naveImage.src = 'Main Ship - Base - Full health.png';
        this.colisao = new Colisao(this.tamanho, 'rgba(255, 255, 0, 0.5)', this.posicaoX, this.posicaoY);
       
        this.iniciarEventListeners();
        
    }

    

    desenhar() {
        // Desenhar a nave
        this.contexto.save();
        this.contexto.translate(this.posicaoX, this.posicaoY);

        // Meter a nave virada para cima
        this.contexto.rotate(this.angulo + Math.PI / 2);

        // Desenhar a nave
        const escala = 2;
        const larguraNave = this.naveImage.width * escala;
        const alturaNave = this.naveImage.height * escala;
        this.contexto.drawImage(this.naveImage, -larguraNave / 2, -alturaNave / 2, larguraNave, alturaNave);
        
        this.contexto.restore();

        // Desenhar a colisão da nave
        this.colisao.desenharColisao(this.debug, this.contexto);

        this.balas.forEach(bala => {
            bala.desenhar(this.contexto); // Chamar o método desenhar da bala
        });
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

        // Atualizar a posição da nave (mover ao longo da órbita)
        this.posicaoX = this.tela.width / 2 + this.raioOrbita * Math.cos(this.angulo);
        this.posicaoY = this.tela.height / 2 + this.raioOrbita * Math.sin(this.angulo);

        // Atualizar a posição da colisão da nave
        this.colisao.atualizarColisao(this.posicaoX, this.posicaoY);

        this.balas.forEach((bala, index) => {
            bala.atualizar();
            // Remove as balas que saíram da tela para evitar acumulação
            if (bala.saiuDaTela()) {
                this.balas.splice(index, 1);
            }
        });
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

        window.addEventListener('keydown', (event) => {
            if (event.key === ' ') { // Tecla de espaço
                this.dispararBala();

            }
        });
    }

    iniciarRegeneracaoBalas() {
        setInterval(() => {
            if (this.balasNoPente < this.maxBalasNoPente) {
                this.balasNoPente += 1;
            }
        }, this.tempoRegeneracao);
    }

    dispararBala() {
        if (this.balasNoPente > 0 && this.podeDisparar) {
            // Posição inicial da bala é a posição atual da nave
            const posicaoBalaX = this.posicaoX;
            const posicaoBalaY = this.posicaoY;

            // Velocidade da bala é definida aqui, ajuste conforme necessário
            const velocidadeBala = 3;

            // Cria uma nova instância de Bala e a adiciona ao array de balas
            this.balas.push(new bala(posicaoBalaX, posicaoBalaY, this.angulo, velocidadeBala, this.debug, this.tela, this.contexto));
            this.audioTiro.volume = this.volume;
            this.audioTiro.play();
            // Reduz o número de balas no pente
            this.balasNoPente -= 1;

            this.podeDisparar = false;
            setTimeout(() => {
                this.podeDisparar = true;
            }, 200);
        }
    }

    resetar(){
        this.posicaoX = this.tela.width / 2 + this.raioOrbita; 
        this.posicaoY = this.tela.height / 2;

    }
}

export default Nave;