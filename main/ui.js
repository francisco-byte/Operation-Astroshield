class Ui {
    constructor(tela, contexto) {
        this.tela = tela;
        this.contexto = contexto;

        this.balaImage = new Image();
        this.balaImage.src = 'BalasSprite.png'; // Substitua pelo caminho correto para sua imagem de bala

        // Definir as dimensões do sprite de bala
        this.frameWidth = 32; // Largura do quadro de bala no sprite
        this.frameHeight = 32; // Altura do quadro de bala no sprite

        // Carregar as imagens de fundo
        this.backgroundImages = [];
        this.backgroundImages.push({ image: new Image(), speed: -0.25 });
        this.backgroundImages[0].image.src = 'Nebula blue.png';
        this.backgroundImages.push({ image: new Image(), speed: -0.5 });
        this.backgroundImages[1].image.src = 'Stars Small_1.png';
        this.backgroundImages.push({ image: new Image(), speed: -1 });
        this.backgroundImages[2].image.src = 'Stars Small_2.png'; 
        this.backgroundImages.push({ image: new Image(), speed: -1.5 });
        this.backgroundImages[3].image.src = 'Stars-big_1_1_PC.png'; 
        this.backgroundImages.push({ image: new Image(), speed: -2 });
        this.backgroundImages[4].image.src = 'Stars-Big_1_2_PC.png'; 

        // Definir a posição inicial dos backgrounds
        this.backgroundPositions = [];
        for (let i = 0; i < this.backgroundImages.length; i++) {
            this.backgroundPositions.push(0); // Posição inicial de cada background
        }
    }

    desenharBackground() {
        const canvasWidth = this.tela.width;
        const canvasHeight = this.tela.height;
    
        // Limpar o canvas
        this.contexto.clearRect(0, 0, canvasWidth, canvasHeight);
    
        // Desenhar os backgrounds
        for (let i = 0; i < this.backgroundImages.length; i++) {
            const { image, speed } = this.backgroundImages[i];
            let xPos = this.backgroundPositions[i];
            
            // Desenhar três instâncias do background
            for (let j = -1; j <= 1; j++) {
                const roundedXPos = Math.round(xPos + j * canvasWidth);
                this.contexto.drawImage(image, roundedXPos, 0, canvasWidth, canvasHeight);
            }

    
            // Atualizar a posição do background
            xPos += speed;
            
            // Verificar se o background saiu da tela
            if (speed < 0) {
                if (xPos <= -canvasWidth) {
                    // Reposicionar o background para a direita do último
                    xPos += canvasWidth * 2;
                }
            } else {
                if (xPos >= canvasWidth) {
                    // Reposicionar o background para a esquerda do primeiro
                    xPos -= canvasWidth * 2;
                }
            }
    
            this.backgroundPositions[i] = xPos;
        }
        
    }

    desenharLabelVidaMundo(vida) {
        this.contexto.font = "30px 'Press Start 2P', Arial, sans-serif";
        this.contexto.fillStyle = "white";
        this.contexto.textAlign = "center";
        this.contexto.fillText("Vida do Mundo: " + vida, this.tela.width / 2, 50);
    }

    clearEcra() {
        this.contexto.clearRect(0, 0, this.tela.width, this.tela.height);
    }

    desenharLabelPontuacao(pontuacao) {
        this.contexto.font = "20px 'Press Start 2P', Arial, sans-serif";
        this.contexto.fillStyle = "white";
        this.contexto.textAlign = "center";
        this.contexto.fillText("Pontuação: " + pontuacao + " pts", this.tela.width / 2, this.tela.height - 30);
    }

    desenharBalasNoPente(balasNoPente, maxBalasNoPente) {
        const escala = 4; // Escala da imagem das balas
        const offsetX = -30; // Espaço entre as balas
        const startX = this.tela.width - 120; // Posição inicial X para desenhar as balas (direita)
        const startY = this.tela.height - 120; // Posição inicial Y para desenhar as balas
        const balaWidth = this.frameWidth * escala;
        const balaHeight = this.frameHeight * escala;

        for (let i = 0; i < maxBalasNoPente; i++) {
            this.contexto.save();
            
            // Se a bala está disponível, desenhe normalmente; caso contrário, faça mais branca
            if (i < balasNoPente) {
                this.contexto.globalAlpha = 1.0; // Opacidade normal
            } else {
                this.contexto.globalAlpha = 0.2; // Mais branca
            }

            // Calcular a posição de cada quadro no sprite sheet
            const srcX = 0; // Supondo que todas as balas estão na primeira linha
            const srcY = 0;

            this.contexto.imageSmoothingEnabled = false;

            // Desenhar a bala do sprite sheet
            this.contexto.drawImage(
                this.balaImage,
                srcX,
                srcY,
                this.frameWidth,
                this.frameHeight,
                startX - i * (balaWidth + offsetX),
                startY,
                balaWidth,
                balaHeight
            );

            this.contexto.imageSmoothingEnabled = true;

            this.contexto.restore();
        }
    }
}

export default Ui;