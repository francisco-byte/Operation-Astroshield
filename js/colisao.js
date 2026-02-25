class Colisao {
    constructor(raio, cor,posicaoX, posicaoY) {
        this.raio = raio;
        this.cor = cor;
        this.posicaoX = posicaoX; // Posição X da colisão
        this.posicaoY = posicaoY; // Posição Y da colisão
    }

    desenharColisao(debug, contexto) {
        // Desenhar a colisão
        if (debug){
            contexto.save();
            contexto.beginPath();
            contexto.arc(this.posicaoX, this.posicaoY, this.raio, 0, Math.PI * 2);
            contexto.fillStyle = this.cor;
            contexto.fill();
            contexto.closePath();
            contexto.restore();
        }
        
    }

    atualizarColisao(posicaoX, posicaoY) {
        // Atualizar a posição da colisão
        this.posicaoX = posicaoX;
        this.posicaoY = posicaoY;
    }
}

export default Colisao;
