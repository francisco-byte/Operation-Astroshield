import Mundo from './mundo.js';
import Nave from './nave.js';
import Inimigo from './inimigos.js'; // Importando a classe Inimigo
import ui from './ui.js';
import bala from "./balas.js";

const tela = document.getElementById('minhaTela');
const contexto = tela.getContext('2d');

var jogoAtivo = false;
const musicas = [
    document.getElementById('musicaJogo1'),
    document.getElementById('musicaJogo2'),
    document.getElementById('musicaJogo3')
];

let musicaAtualIndex = 0;


var musicaMenu = document.getElementById('musicaMenu');
var audioMorte = document.getElementById('audioMorte');
var audioTiro = document.getElementById('audioTiro');
var audioDano = document.getElementById('audioDano');
var audioMorteInimigo = document.getElementById('audioMorteInimigo');

tela.width = window.innerWidth;
tela.height = window.innerHeight;

let debug = false; // Variável para controlar a visualização de colisão

const mundo = new Mundo(tela, debug, contexto);
const nave = new Nave(tela, debug, contexto, audioTiro); // Passando a tela e o raio do mundo para a nave
const inimigos = []; // Array para armazenar os inimigos
const jogoUi = new ui(tela, contexto);
var pontuacao = 0;
var nome = "";
const volume = 0.1;
let mute = false;
// Defina uma variável de controle global
let dadosEnviados = false;

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
    jogoUi.desenharBackground();
    mundo.desenhar(contexto);
    nave.atualizar();
    nave.desenhar();
    jogoUi.desenharLabelVidaMundo(mundo.vida);
    jogoUi.desenharLabelPontuacao(pontuacao);

    applyScreenShake();


    // Atualizar e desenhar inimigos
    for (let i = 0; i < inimigos.length; i++) {
        const inimigo = inimigos[i];
        inimigo.atualizar();

        // Verifica colisões entre as balas da nave e os inimigos
        for (let j = 0; j < nave.balas.length; j++) {
            const bala = nave.balas[j];
            if (bala.colisao.detetarColisoes(bala.colisao, inimigo.colisao)) {
                // Bala colidiu com o inimigo
                nave.balas.splice(j, 1); // Remove a bala
                inimigo.vida -= bala.dano; // Reduz a vidaBase do inimigo
                if (inimigo.vida <= 0) {
                    // Inimigo morreu
                    inimigos.splice(i, 1); // Remove o inimigo
                    audioMorteInimigo.volume = volume - 0.02;
                    audioMorteInimigo.play();
                    pontuacao += 50; // Aumenta a pontuação
                    i--; // Decrementa o índice para evitar problemas de iteração
                }
            }
        }

        // Verifica colisões entre o mundo/nave e os inimigos
        if (mundo.colisao.detetarColisoes(mundo.colisao, inimigo.colisao) || nave.colisao.detetarColisoes(nave.colisao, inimigo.colisao)) {
            mundo.perderVida(); // Reduz a vida do mundo
            
            if(mundo.vida >= 1){
                startScreenShake(5, 10);
                audioDano.play();
            }
            

            inimigos.splice(i, 1); // Remove o inimigo
            i--; // Decrementa o índice para evitar problemas de iteração
        }

        inimigo.desenhar(contexto, debug);
    }

    jogoUi.desenharBalasNoPente(nave.balasNoPente, nave.maxBalasNoPente);

    if (mundo.vida <= 0) {
        // Se o mundo perdeu toda a vida, o jogo acabou
        jogoUi.clearEcra();
        jogoAtivo = false;
        document.getElementById('menu').style.display = 'flex'; // Mostra o menu
        document.getElementById('gameTitle').style.display = 'block'; // Mostra o título do jogo
        document.getElementById('gameOverMessage').style.display = 'block'; // Mostra a mensagem de Game Over
        document.getElementById('finalScore').style.display = 'block'; // Mostra a pontuação final
        document.getElementById('finalScore').innerText = `Pontuação Final: ${pontuacao}`;
        document.getElementById('minhaTela').style.display = 'none'; // Esconde o canvas do jogo
        musicas[musicaAtualIndex].pause();
        musicas[musicaAtualIndex].currentTime = 0;
        audioMorte.play();

        // Usa requestAnimationFrame para garantir que a renderização do menu esteja completa antes de chamar JanelaNomeJogador
        requestAnimationFrame(() => {
            // Chamar a função para mostrar o modal
            showUsernamePopup();
        });

    dadosEnviados = false;

        setTimeout(() => {
            // Verifica se o jogo está inativo e se o som não está mutado
            IniciarSomMusicaMenu();
        }, 4000); // Atraso de 1000 milissegundos (1 segundo)
    }

    if (jogoAtivo) {
        requestAnimationFrame(atualizar);
    }
}

let criarInimigosTimeout;

// Função para reiniciar o jogo
function reiniciarJogo() {
    limparTela();
    mundo.vida = mundo.vidaInicial;
    nave.resetar();
    inimigos.length = 0;
    nave.balas.length = 0;
    nave.balasNoPente = 5;
    pontuacao = 0;
    clearTimeout(criarInimigosTimeout);
    document.getElementById('gameOverMessage').style.display = 'none'; // Esconde a mensagem de Game Over
    document.getElementById('finalScore').style.display = 'none'; // Esconde a pontuação final

    // Resetar a música
    if (musicas[musicaAtualIndex]) {
        musicas[musicaAtualIndex].pause();
        musicas[musicaAtualIndex].currentTime = 0;
        musicas[musicaAtualIndex].removeEventListener('ended', tocarProximaMusica);
    }
    musicaAtualIndex = 0;

    // Tocar a primeira música novamente
    tocarProximaMusica();

    // Resetar a dificuldade dos inimigos

    for (let i = 0; i < inimigos.length; i++) {
        Inimigo.resetarDificuldade(inimigos[i]);
    }
    
}


// Função para criar novos inimigos em intervalos regulares
function criarInimigos() {
    const intervalo = 4000; // Intervalo em milissegundos (ajuste conforme necessário)

    // Função interna para criar um inimigo e agendar a criação do próximo
    function criarInimigo() {
        const inimigo = new Inimigo(tela, mundo.raio); // Criar um novo inimigo
        inimigos.push(inimigo); // Adicionar ao array de inimigos

        // Agendar a criação do próximo inimigo após o intervalo
        criarInimigosTimeout = setTimeout(criarInimigo, intervalo);
        console.log(inimigo.vida)
        console.log(inimigo.velocidade)
    }

    // Inicia a criação do primeiro inimigo após o intervalo
    criarInimigosTimeout = setTimeout(criarInimigo, intervalo);
    
}

function showUsernamePopup() {
    const usernameModal = document.getElementById("usernameModal");
    const usernameInput = document.getElementById("usernameInput");
    const errorMessage = document.getElementById("errorMessage");

    function showModal(modal) {
        modal.style.display = "flex";
        void modal.offsetWidth;
        modal.style.animation = "fadeIn 1s forwards";
    }

    function hideModal(modal) {
        modal.style.display = "none";
        // Volta ao menu principal após fechar o modal
        document.getElementById('menu').style.display = 'flex'; // Mostra o menu
        document.getElementById('gameTitle').style.display = 'block'; // Mostra o título do jogo
        document.getElementById('gameOverMessage').style.display = 'block'; // Esconde a mensagem de Game Over
        document.getElementById('finalScore').style.display = 'block'; // Esconde a pontuação final
        document.getElementById('minhaTela').style.display = 'none'; // Esconde o canvas do jogo
        IniciarSomMusicaMenu();
    }

 function handleUsername() {
    const username = usernameInput.value.trim();
    if (username.length <= 15) {
        hideModal(usernameModal);
        errorMessage.style.display = "none"; // Esconde a mensagem de erro
        nome = username;
        if (!dadosEnviados) {
            enviarDadosParaFlask(nome, pontuacao); // Chama enviarDadosParaFlask apenas se os dados ainda não foram enviados
            dadosEnviados = true; // Atualiza a variável de controle para indicar que os dados foram enviados
        }
    } else {
        errorMessage.textContent = "O username não pode ter mais de 15 caracteres.";
        errorMessage.style.display = "block"; // Mostra a mensagem de erro
    }
}


    // Inicializa o campo de nome de usuário com um valor vazio
    usernameInput.value = "";
    errorMessage.style.display = "none"; // Esconde a mensagem de erro inicialmente

    // Mostra o modal de username
    showModal(usernameModal);

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.addEventListener("click", handleUsername);
}

let shakeIntensity = 0;
let shakeDuration = 0;
let shakeDecay = 0.95; 

function applyScreenShake() {
    if (shakeDuration > 0) {
        const offsetX = (Math.random() * 2 - 1) * shakeIntensity;
        const offsetY = (Math.random() * 2 - 1) * shakeIntensity;
        tela.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
        shakeIntensity *= shakeDecay;
        shakeDuration--;
    } else {
        tela.style.transform = 'translate(0, 0)';
    }
}

function startScreenShake(intensity, duration) {
    shakeIntensity = intensity;
    shakeDuration = duration;
}

// Expor a função globalmente para que possa ser chamada de qualquer lugar
window.showUsernamePopup = showUsernamePopup;

function enviarDadosParaFlask(nome, pontuacao) {
    fetch('/enviar_dados', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome: nome, pontuacao: pontuacao }),
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch((error) => {
        console.error('Erro:', error);
    });
}


window.addEventListener('resize', () => {
    tela.width = window.innerWidth;
    tela.height = window.innerHeight;
    mundo.atualizarPosicao(tela);
});



document.getElementById('btn-jogar').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    const gameTitle = document.getElementById('gameTitle');
    const minhaTela = document.getElementById('minhaTela');

    menu.style.display = 'none';
    gameTitle.style.display = 'none';
    minhaTela.style.display = 'block';

    reiniciarJogo();
    musicaMenu.pause();
    musicaMenu.currentTime = 0;

    const isMenuMuted = musicaMenu.volume === 0;

    if (!jogoAtivo) {
        jogoAtivo = true;
        atualizar();
        
        musicaAtualIndex = 0; 
        musicas[musicaAtualIndex].volume = volume; 
        musicas[musicaAtualIndex].play();
        musicas[musicaAtualIndex].addEventListener('ended', tocarProximaMusica);
        criarInimigos();

        if (isMenuMuted) {
            musicas[musicaAtualIndex].volume = 0;
        }
    }
});

// Função para mostrar instruções sobre como jogar quando clicar no botão "Como Jogar"
document.getElementById('btn-como-jogar').addEventListener('click', () => {
    // Selecionar o modal "Como Jogar" e adicionar o botão "Voltar"
    const comoJogarModalBackground = document.getElementById('comoJogarModalBackground');
    const comoJogarModal = document.getElementById('comoJogarModal');
    
    // Verificar se já existe um botão "Voltar" presente no modal e removê-lo, se necessário
    const existingBackButton = comoJogarModal.querySelector('button');
    if (existingBackButton) {
        comoJogarModal.removeChild(existingBackButton);
    }
    
    // Criar o botão "Voltar"
    const backButton2 = document.createElement('button');
    backButton2.textContent = 'Voltar';
    backButton2.addEventListener('click', fecharComoJogarModal);
    
    // Adicionar o botão "Voltar" ao modal "Como Jogar"
    comoJogarModal.appendChild(backButton2);

    // Exibir o modal "Como Jogar"
    comoJogarModalBackground.style.display = 'block';
    comoJogarModal.style.display = 'block';
});

// Função para fechar o modal "Como Jogar"
function fecharComoJogarModal() {
    const comoJogarModalBackground = document.getElementById('comoJogarModalBackground');
    const comoJogarModal = document.getElementById('comoJogarModal');

    comoJogarModalBackground.style.display = 'none';
    comoJogarModal.style.display = 'none';
}


// Função para mostrar os líderes do jogo quando clicar no botão "Ver Leaderboards"
document.getElementById('btn-ver-leaderboards').addEventListener('click', () => {
    // Código para abrir o arquivo de texto
    fetch('scoreboard.txt')
        .then(response => response.text())
        .then(text => {
            // Criar um elemento para o fundo transparente
            const background = document.createElement('div');
            background.classList.add('popup-background');

            // Criar um elemento para o pop-up
            const popup = document.createElement('div');
            popup.classList.add('popup');

            // Criar um elemento para o cabeçalho do pop-up
            const header = document.createElement('div');
            header.classList.add('popup-header');

            // Criar elementos para os cabeçalhos de posição, nome e pontuação
            const positionHeader = document.createElement('div');
            positionHeader.classList.add('header-item');
            positionHeader.textContent = 'Posição';
            const nameHeader = document.createElement('div');
            nameHeader.classList.add('header-item');
            nameHeader.textContent = 'Nome';
            const scoreHeader = document.createElement('div');
            scoreHeader.classList.add('header-item');
            scoreHeader.textContent = 'Pontuação';

            // Adicionar cabeçalhos ao cabeçalho do pop-up
            header.appendChild(positionHeader);
            header.appendChild(nameHeader);
            header.appendChild(scoreHeader);

            // Adicionar cabeçalho ao pop-up
            popup.appendChild(header);

            // Adicionar um espaço entre os cabeçalhos e o conteúdo do arquivo de texto
            const space = document.createElement('div');
            space.style.marginBottom = '10px';
            popup.appendChild(space);

            // Criar um elemento para o conteúdo do pop-up
            const content = document.createElement('div');
            content.classList.add('popup-content');

            // Adicionar o texto ao conteúdo do pop-up com posições
            const lines = text.split('\n');
            lines.forEach((line, index) => {
                if (line.trim()) {
                    // Separar cada linha pelos delimitadores ": " e ", "
                    const [namePart, scorePart] = line.split(', ');
                    const name = namePart.split(': ')[1];
                    const score = scorePart.split(': ')[1];

                    // Criar um elemento de linha para cada conjunto de dados
                    const row = document.createElement('div');
                    row.classList.add('popup-row');

                    // Criar elementos para posição, nome e pontuação
                    const positionElement = document.createElement('div');
                    positionElement.classList.add('row-item');
                    positionElement.textContent = `${index + 1}º`;
                    row.appendChild(positionElement);

                    const nameElement = document.createElement('div');
                    nameElement.classList.add('row-item');
                    nameElement.textContent = name;
                    row.appendChild(nameElement);

                    const scoreElement = document.createElement('div');
                    scoreElement.classList.add('row-item');
                    scoreElement.textContent = score;
                    row.appendChild(scoreElement);

                    // Aplicar classes baseadas na posição
                    if (index === 0) {
                        row.classList.add('first-place');
                    } else if (index === 1) {
                        row.classList.add('second-place');
                    } else if (index === 2) {
                        row.classList.add('third-place');
                    }

                    // Adicionar a linha ao conteúdo do pop-up
                    content.appendChild(row);
                }
            });

            // Adicionar o conteúdo ao pop-up
            popup.appendChild(content);

            // Adicionar um botão de voltar
            const backButton = document.createElement('button');
            backButton.textContent = 'Voltar';
            backButton.addEventListener('click', () => {
                document.body.removeChild(background);
                document.body.removeChild(popup);
            });

            // Adicionar o botão ao pop-up
            popup.appendChild(backButton);

            // Adicionar o fundo transparente e o pop-up ao corpo do documento
            document.body.appendChild(background);
            document.body.appendChild(popup);

            // Exibir o fundo transparente e o pop-up
            background.style.display = 'block';
            popup.style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo:', error);
        });
});



function tocarProximaMusica() {
    if (!jogoAtivo) return;

    
    if (musicas[musicaAtualIndex]) {
        musicas[musicaAtualIndex].pause();
        musicas[musicaAtualIndex].currentTime = 0;
        musicas[musicaAtualIndex].removeEventListener('ended', tocarProximaMusica);
    }

    
    musicaAtualIndex = (musicaAtualIndex + 1) % musicas.length;

    
    musicas[musicaAtualIndex].volume = volume; 
    musicas[musicaAtualIndex].play();
    musicas[musicaAtualIndex].addEventListener('ended', tocarProximaMusica);

    
    if (musicaAtualIndex > 0) {
        console.log('Aumentando dificuldade dos inimigos');
        Inimigo.aumentarDificuldade();
    }
}



function IniciarSomMusicaMenu() {
    musicaMenu.setAttribute("preload", "auto");
    musicaMenu.autobuffer = true;
    musicaMenu.load();
    
    if (!mute) { // Verifica se o mute não está ativado
        musicaMenu.volume = volume - 0.03;
        // Adiciona um atraso de 1 segundo antes de iniciar a música
        if (!jogoAtivo) {
            musicaMenu.play();
        }
    } else {
        // Se o mute estiver ativado, mantém o volume em 0
        musicaMenu.volume = 0;
    }
}

function iniciarMusicaMenuLoad() {
    musicaMenu.setAttribute("preload", "auto");
    musicaMenu.autobuffer = true;
    musicaMenu.load();
    musicaMenu.volume = volume - 0.03;

    // Adiciona um event listener para detectar o primeiro clique do usuário
    const primeiroClique = () => {
        if (!jogoAtivo) { // Verifica se o jogo está inativo
            musicaMenu.play();
        }
        document.removeEventListener('click', primeiroClique);
    };
    
    // Adiciona o event listener para detectar o primeiro clique do usuário
    document.addEventListener('click', primeiroClique);
}

window.addEventListener('load', () => {
    iniciarMusicaMenuLoad(); // Inicia a música do menu
});


// Função para alternar o estado de mute
function toggleMute() {
    mute = !mute; // Alterna o estado de mute

    if (mute) {
        // Se o mute estiver ativado, define o volume como 0 para todos os áudios
        musicaMenu.volume = 0;
        musicas[musicaAtualIndex].volume = 0;
        document.getElementById('btn-mute').innerText = 'Unmute'; // Altera o texto do botão para "Unmute"
    } else {
        // Se o mute estiver desativado, restaura os volumes
        musicaMenu.volume = volume - 0.03;
        IniciarSomMusicaMenu();
        musicas[musicaAtualIndex].volume = volume;
        document.getElementById('btn-mute').innerText = 'Mute'; // Altera o texto do botão para "Mute"
    }
}


// Adiciona um event listener para alternar o mute quando o botão de mute for clicado
document.getElementById('btn-mute').addEventListener('click', toggleMute);
