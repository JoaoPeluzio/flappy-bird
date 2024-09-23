//board canvas

let board;
let boardWidth = 360;
let boardHeight = 630;
let context;

//configuração do bird

let birdWidth = 34;
let birdHeight = 24;
let birdX =  boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
};

//pipes

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//fisica do jogo

let velocityX = -2; //faz as pipes se moverem para esquerda(-) no eixo X. 

let velocityY = 0; //faz o controle de pulo do bird 

let gravity = 0.4; //faz o bird ser atraido para baixo

let gameOver = false;
let score = 0;


window.onload = function () {
    board = document.getElementById("board");
    context = board.getContext("2d"); //usado para desenhar no boad canvas

    board.height = boardHeight;
    board.width = boardWidth;

    //desenhando o bird

    /*context.fillStyle = "green";
    context.fillRect(bird.x, bird.y, bird.width, bird.height);*/

    //carregando a imagem do bird

    birdImg = new Image();
    birdImg.src = "./img/flappybird.png";
    
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    //carregando imagens das pipes

    topPipeImg = new Image();
    topPipeImg.src = "./img/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./img/bottompipe.png";

    requestAnimationFrame(update); //chama a requisicao da funcao update

    setInterval(placePipes, 1500); // configura as pipes para aparecer a cada 1.5 segundos 

    //teclado para controlar o bird

    document.addEventListener('keydown', moveBird );
}

//loop para movimentação do game e atualizacao dos frames

function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, boardWidth, boardHeight); //limpando o canvas

    //desenha o bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); 

    if (bird.y > board.height) {
        gameOver = true;
    }

    //desenha as pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        //logica da pontuacao
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        //se colide entao gameover
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //limpandos as pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //remove o primeiro elemento do array
    }

    //escrevendo os pontos na tela
    context.fillStyle = 'white';
    context.font = '45px sans-serif';
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText('GAME OVER', 5, 90);
    }
}

//funcao para movimentacao das pipes

function placePipes() {

    if (gameOver) {
        return;
    }
    
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);

    let openingSpace = board.height / 4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //checa se o passaro passou da pipe
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //checa se o passaro passou da pipe
    }

    pipeArray.push(bottomPipe);

}

//funcao de controle de movimento do bird

function moveBird(e) {
    if (e.code == 'Space' || e.code == 'ArrowUp' || e.code == 'KeyX') {
        //pulo
        velocityY = -6;

        //resetando o jogo
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

//colisoes das pipes

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}