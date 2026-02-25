import Colisao from "./colisao.js";

class Inimigo {
    static vidaBase = 5; // Vida base inicial dos inimigos
    static velocidadeBase = 2; // Velocidade base inicial dos inimigos

    constructor(tela, raioMundo) {
        this.tela = tela;
        this.raioMundo = raioMundo;
        this.raio = 50;
        this.pixeis = 48;
        this.raioColisao = this.raio - 5;
        this.velocidade = Inimigo.velocidadeBase;
        this.posicaoX = 0; // Posição inicial fora da tela (esquerda)
        this.posicaoY = 0; // Posição inicial fora da tela (cima)
        this.direcaoX = 0; // Direção inicial (será definida no método iniciar)
        this.direcaoY = 0; // Direção inicial (será definida no método iniciar)
        this.inimigosImage = new Image();
        this.vida = Inimigo.vidaBase;
        this.colisao = new Colisao(this.raioColisao, 'rgba(255, 166, 0, 0.5)', this.posicaoX, this.posicaoY);
        this.definirImagemAleatoria();
        this.iniciar();
    }

    iniciar() {
        // Definir posição inicial fora da tela (esquerda ou direita) e direção para mover em direção ao mundo
        if (Math.random() < 0.5) {
            // Spawn à esquerda
            this.posicaoX = -this.raioColisao;
            this.posicaoY = Math.random() * this.tela.height; // Posição vertical aleatória
            this.direcaoX = 1; // Mover para a direita

            // Calcular a direção Y em direção ao centro da tela
            this.direcaoY = (this.tela.height / 2 - this.posicaoY) / this.tela.height;

        } else {
            // Spawn à direita
            this.posicaoX = this.tela.width + this.raioColisao;
            this.posicaoY = Math.random() * this.tela.height; // Posição vertical aleatória
            this.direcaoX = -1; // Mover para a esquerda

            // Calcular a direção Y em direção ao centro da tela
            this.direcaoY = (this.tela.height / 2 - this.posicaoY) / this.tela.height;
        }

        // Normalizar a direção para manter o mesmo comprimento do vetor
        const length = Math.sqrt(this.direcaoX ** 2 + this.direcaoY ** 2);
        this.direcaoX /= length;
        this.direcaoY /= length;
    }

    definirImagemAleatoria() {
        const randomValue = Math.random();
        if (randomValue < 0.25) {
            this.inimigosImage.src = 'Lava.png';
        } else if (randomValue < 0.5) {
            this.inimigosImage.src = 'Ice.png';
        } else if (randomValue < 0.75) {
            this.inimigosImage.src = 'Baren.png';
        } else {
            this.inimigosImage.src = 'Black_hole.png';
        }
    }

    atualizar() {
        // Movimentar em direção ao centro do mundo
        this.posicaoX += this.direcaoX * this.velocidade;
        this.posicaoY += this.direcaoY * this.velocidade;
        this.colisao.atualizarColisao(this.posicaoX + this.pixeis, this.posicaoY + this.pixeis);
    }

    desenhar(contexto, debug) {
        const novaLargura = this.inimigosImage.width * 2;
        const novaAltura = this.inimigosImage.height * 2;

        // Desativar o suavização de imagem para manter a aparência pixelizada
        contexto.imageSmoothingEnabled = false;

        // Desenhar o mundo (círculo) escalado para o novo tamanho
        contexto.drawImage(this.inimigosImage, this.posicaoX, this.posicaoY, novaLargura, novaAltura); // Desenhar a imagem escalada no centro da tela

        // Reativar a suavização de imagem para outros desenhos
        contexto.imageSmoothingEnabled = true;
        this.colisao.desenharColisao(debug, contexto);
    }

    evitarColisoes(outroInimigo) {
        const dx = this.posicaoX - outroInimigo.posicaoX;
        const dy = this.posicaoY - outroInimigo.posicaoY;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        const distanciaMinima = this.raioColisao + outroInimigo.raioColisao;

        // Se houver colisão
        if (distancia < distanciaMinima) {
            // Calcular a direção da colisão
            const direcaoX = dx / distancia;
            const direcaoY = dy / distancia;

            // Calcular a sobreposição
            const sobreposicao = distanciaMinima - distancia;

            // Mover os inimigos para longe um do outro
            this.posicaoX -= direcaoX * sobreposicao / 2;
            this.posicaoY -= direcaoY * sobreposicao / 2;
            outroInimigo.posicaoX += direcaoX * sobreposicao / 2;
            outroInimigo.posicaoY += direcaoY * sobreposicao / 2;
        }
    }

    static aumentarDificuldade() {
        Inimigo.vidaBase += 5; // Aumenta a vida base dos inimigos
        Inimigo.velocidadeBase *= 1.1; // Aumenta a velocidade base dos inimigos
        console.log('Nova vida base:', Inimigo.vidaBase);
        console.log('Nova velocidade base:', Inimigo.velocidadeBase);
    }
    
    static resetarDificuldade() {
        Inimigo.vidaBase = 5;
        Inimigo.velocidadeBase = 2;
    }
}

export default Inimigo;

