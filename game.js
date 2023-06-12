const cvs = document.getElementById('breakout');
const ctx = cvs.getContext('2d')
cvs.style.border = '5px solid black'
ctx.lineWidth = 3;
let leftArrow = false;
let rightArrow = false;
const BALL_RADIUS = 8;
let LIFE = 3;


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

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.closePath();

}
//Move tthe ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

}




// DRAW FUNCTION
function draw() {
    drawPaddle();
    drawBall()



}

//balll and wall collisions detection
function ballWallCollision() {
    if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
        ball.dx = - ball.dx;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > cvs.height) {
        LIFE--;
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
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);
        //normalize the values
        collidePoint = collidePoint / (paddle.width / 2);
        //calculate the angle
        let angle = collidePoint * Math.PI / 3;


        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

//UPDATE FAME FUNCTION 
function update() {
    movePaddle()
    moveBall()
    ballWallCollision()
    ballPaddleCollision()

}

function loop() {
    //clear canvas
    ctx.drawImage(bg_img, 0, 0);
    draw();
    update();

    requestAnimationFrame(loop);
}
loop()
