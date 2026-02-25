import Mundo from './mundo.js';
import Nave from './nave.js';
import Inimigo from './inimigos.js'; // Importando a classe Inimigo

const tela = document.getElementById('minhaTela');
const contexto = tela.getContext('2d');

tela.width = window.innerWidth;
tela.height = window.innerHeight;

let debug = true; // Variável para controlar a visualização de colisão

const mundo = new Mundo(tela, debug);
const nave = new Nave(tela, mundo.raio, debug, contexto); // Passando a tela e o raio do mundo para a nave
const inimigos = []; // Array para armazenar os inimigos



function ajustarTamanhoCanvas() {
    tela.width = window.innerWidth;
    tela.height = window.innerHeight;
}
function limparTela() {
    contexto.clearRect(0, 0, tela.width, tela.height);
    ajustarTamanhoCanvas();
}

function atualizar() {
    limparTela();
    mundo.desenhar(contexto);
    nave.atualizar();
    nave.desenhar();
    // Atualizar e desenhar inimigos
    for (let i = 0; i < inimigos.length; i++) {
        const inimigo = inimigos[i];
        inimigo.atualizar();
        inimigo.desenhar(contexto, debug);
    }

    requestAnimationFrame(atualizar);
}

// Função para criar novos inimigos em intervalos regulares
function criarInimigos() {
    const intervalo = 3000; // Intervalo em milissegundos (ajuste conforme necessário)
    setInterval(() => {
        const inimigo = new Inimigo(tela, mundo.raio); // Criar um novo inimigo
        inimigos.push(inimigo); // Adicionar ao array de inimigos
    }, intervalo);
}



window.addEventListener('resize', () => {
    tela.width = window.innerWidth;
    tela.height = window.innerHeight;
    mundo.atualizarPosicao(tela);
});

atualizar();
criarInimigos(); // Iniciar a criação de inimigos
