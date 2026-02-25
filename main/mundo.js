import Colisao from "./colisao.js"

class Mundo {

        constructor(tela, debug,contexto) {
            this.mundoImage = new Image();
            this.mundoImage.src = 'Terran.png';
            this.raio = 150;
            this.posicaoX = tela.width / 2;
            this.posicaoY = tela.height / 2;
            this.raioColisao = this.raio - 5;
            this.debug = debug;
            this.tela = tela;
            this.contexto = contexto
            this.vidaInicial = 10;
            this.vida = this.vidaInicial;
            this.colisao = new Colisao(this.raioColisao, 'rgba(255,0,0,0.29)', this.posicaoX, this.posicaoY);
        }


        atualizarPosicao(tela) {
            this.posicaoX = tela.width / 2;
            this.posicaoY = tela.height / 2;
            this.raioColisao = this.raio - 5;
            this.colisao.atualizarColisao(this.posicaoX,this.posicaoY)
        }

        
        desenhar() {
            // Calcular as coordenadas x e y para desenhar a imagem do mundo no centro da tela
            const novaLargura = this.mundoImage.width * 6;
            const novaAltura = this.mundoImage.height * 6;

            const x = this.tela.width / 2 - novaLargura / 2;
            const y = this.tela.height / 2 - novaAltura / 2;
        
            // Definir o tamanho desejado para a imagem (por exemplo, multiplicar a largura e altura original por 3)
            
        
            // Desativar o suavização de imagem para manter a aparência pixelizada
            this.contexto.imageSmoothingEnabled = false;
        
            // Desenhar o mundo (círculo) escalado para o novo tamanho
            this.contexto.drawImage(this.mundoImage, x, y, novaLargura, novaAltura); // Desenhar a imagem escalada no centro da tela
        
            // Reativar a suavização de imagem para outros desenhos
            this.contexto.imageSmoothingEnabled = true;
        
           
           this.colisao.desenharColisao(this.debug, this.contexto);
        
        }

        perderVida(){
            this.vida = this.vida-1;
        }

        

        // detetar colisoes entre o mundo e inimigos
       
        


}
export default Mundo;
