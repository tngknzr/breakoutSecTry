// img loading

const bg_img = new Image();
bg_img.src = "img/bg.jpg";

const level_img = new Image();
level_img.src = "img/level.png";

const score_img = new Image();
score_img.src = "img/score.png";
const life_img = new Image();
life_img.src = "img/life.png";


// load sound
const WALL_HIT = new Audio();
WALL_HIT.src = "sounds/wall.mp3"

const LIFE_LOST = new Audio();
LIFE_LOST.src = "sounds/life_lost.mp3"

const PADDLE_HIT = new Audio();
PADDLE_HIT.src = "sounds/paddle_hit.mp3"

const WIN = new Audio();
WIN.src = "sounds/win.mp3"

const BRICK_HIT = new Audio();
BRICK_HIT.src = "sounds/brick_hit.mp3"