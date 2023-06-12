const cvs = document.getElementById('breakout');
const ctx = cvs.getContext('2d')
cvs.style.border = '5px solid black'
ctx.lineWidth = 3;
let leftArrow = false;
let rightArrow = false;
const BALL_RADIUS = 8;
let LIFE = 3;
let SCORE = 0;
let SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;
let GAME_OVER = false;


// game variables and constants
const PADDLE_WIDTH = 100;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_HEIGHT = 20;


// CREATE PADDLE

const paddle = {
    x: cvs.width / 2 - PADDLE_WIDTH / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 5
}

// DRAW PADDLE 
function drawPaddle() {
    ctx.fillStyle = "red";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);

}
//control paddle
document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowLeft") {
        leftArrow = true;
    } else if (event.key == "ArrowRight") {
        rightArrow = true;
    }
});
document.addEventListener('keyup', function (event) {
    if (event.key == "ArrowLeft") {
        leftArrow = false;
    } else if (event.key == "ArrowRight") {
        rightArrow = false;
    }
});

//move paddle
function movePaddle() {
    if (rightArrow && paddle.x + paddle.width < cvs.width) {
        paddle.x += paddle.dx;
    } else if (leftArrow && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

//create the ball
const ball = {
    x: 200,
    y: 420,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}
//draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.closePath();

}
//Move tthe ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

}


// create the brick
const brick = {
    row: 3,
    colum: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#fff"
}
let bricks = [];
function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.colum; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }
}
createBricks();
//drow the bricks
function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.colum; c++) {
            let b = bricks[r][c];
            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}
//ball bric collision
function ballBrickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.colum; c++) {
            let b = bricks[r][c];
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    BRICK_HIT.play();
                    ball.dy = - ball.dy;
                    b.status = false;
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}
//show gamestats
function showGameStats(text, textX, textY, img, imgX, imgY) {
    //draw text
    ctx.fillStyle = "#fff";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    ctx.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// DRAW FUNCTION
function draw() {
    drawPaddle();
    drawBall();
    drawBricks();
    showGameStats(SCORE, 35, 25, score_img, 5, 5);
    showGameStats(LIFE, cvs.width - 25, 25, life_img, cvs.width - 55, 5);
    showGameStats(LEVEL, cvs.width / 2, 25, level_img, cvs.width / 2 - 30, 5);




}

//balll and wall collisions detection
function ballWallCollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = - ball.dx;
        WALL_HIT.play();
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
        WALL_HIT.play();
    }
    if (ball.y + ball.radius > cvs.height) {
        LIFE--;
        LIFE_LOST.play();
        resetBall();
    }
}
function resetBall() {
    ball.x = 200;
    ball.y = 420;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}
//ball and paddle collision
function ballPaddleCollision() {
    if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {
        //check where the ball hit the paddle
        PADDLE_HIT.play();
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);
        //normalize the values
        collidePoint = collidePoint / (paddle.width / 2);
        //calculate the angle
        let angle = collidePoint * Math.PI / 3;


        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}
//game over
function gameOver() {
    if (LIFE <= 0) {
        showYouLose();
        GAME_OVER = true;
    }
}
//level up
function levelUp() {
    let isLevelDone = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.colum; c++) {
            isLevelDone = isLevelDone && !bricks[r][c].status;

        }
    }
    if (isLevelDone) {
        WIN.play();
        if (LEVEL >= MAX_LEVEL) {
            showYouWin();

            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 2;
        resetBall();
        LEVEL++;
    }
}

//UPDATE gAME FUNCTION 
function update() {
    movePaddle()
    moveBall()
    ballWallCollision()
    ballPaddleCollision()
    ballBrickCollision()
    gameOver()
    levelUp()

    // 

}

function loop() {
    //clear canvas
    ctx.drawImage(bg_img, 0, 0);
    draw();
    update();
    if (!GAME_OVER) {
        requestAnimationFrame(loop);
    }

}
loop()

const soundElement = document.getElementById("sound");
soundElement.addEventListener("click", audioManager);
function audioManager() {
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" :
        "img/SOUND_ON.png";
    soundElement.setAttribute("src", SOUND_IMG);
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
}
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");
restart.addEventListener("click", function () {
    location.reload();
})

function showYouWin() {
    gameover.style.display = "block";
    youwin.style.display = "block"
    youlose.style.display = "none"
}
function showYouLose() {
    gameover.style.display = "block";
    youlose.style.display = "block";
    youwin.style.display = "none";
}

