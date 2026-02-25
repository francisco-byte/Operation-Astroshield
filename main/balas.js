import Colisao from "./colisao.js";

class Bala {
    constructor(posicaoX, posicaoY, angulo, velocidade, debug, tela, contexto) {
        this.posicaoX = posicaoX;
        this.posicaoY = posicaoY;
        this.angulo = angulo;
        this.velocidade = velocidade;
        this.debug = debug;
        this.tela = tela;
        this.raio = 5;
        this.contexto = contexto;
        this.dano = 5;

        this.raioColisao = this.raio - 3;
        this.colisao = new Colisao(this.raioColisao, 'red', this.posicaoX, this.posicaoY);

        // Carregar a imagem do sprite sheet
        this.spriteSheet = new Image();
        this.spriteSheet.src = 'BalasSprite.png';

        // Configurações do sprite sheet
        this.frameWidth = 32; // Largura de cada quadro no sprite sheet
        this.frameHeight = 32; // Altura de cada quadro no sprite sheet
        this.currentFrame = 0; // Quadro atual exibido
        this.totalFrames = 4; // Número total de quadros no sprite sheet
        this.frameRate = 10; // Taxa de atualização dos quadros (em milissegundos)
        this.frameCounter = 0; // Contador para controle da taxa de atualização dos quadros
    }

    atualizar() {
        // Movimento da bala na direção do ângulo
        this.posicaoX += Math.cos(this.angulo) * this.velocidade;
        this.posicaoY += Math.sin(this.angulo) * this.velocidade;
        this.colisao.atualizarColisao(this.posicaoX, this.posicaoY);

        // Atualizar o contador de quadros
        this.frameCounter++;
        if (this.frameCounter >= this.frameRate) {
            // Avança para o próximo quadro
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            this.frameCounter = 0; // Reinicia o contador
        }
    }

    desenhar() {
        // Salva o estado atual do contexto
        this.contexto.save();

        // Calcula a posição do quadro atual no sprite sheet
        const srcX = this.currentFrame * this.frameWidth;
        const srcY = 0; // No exemplo, todos os quadros estão na mesma linha

        // Move o contexto para a posição da bala
        this.contexto.translate(this.posicaoX, this.posicaoY);

        // Rotaciona o contexto para a direção da bala
        this.contexto.rotate(this.angulo + Math.PI / 2);

        // Desenha o quadro atual do sprite sheet
        this.contexto.drawImage(this.spriteSheet, srcX, srcY, this.frameWidth, this.frameHeight, -this.frameWidth / 2, -this.frameHeight / 2, this.frameWidth, this.frameHeight);

        // Restaura o estado do contexto
        this.contexto.restore();
    }

    saiuDaTela() {
        // Verifica se a bala saiu da tela
        return (
            this.posicaoX < 0 ||
            this.posicaoX > this.tela.width ||
            this.posicaoY < 0 ||
            this.posicaoY > this.tela.height
        );
    }
}





export default Bala;
