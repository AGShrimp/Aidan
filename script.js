let gravity = 0.2;
let bird_dy = 0;
let score = 0;
let game_state = "start";

let pipes = [];
let pipe_gap = 150;

console.log(bird_dy);

let gameInterval = null;

let frame = 0;
const frame_time = 100;

let bird = document.getElementById("bird");
let score_display = document.getElementById("score");
let game_container = document.getElementById("game_container");
let start_btn = document.getElementById("start-btn");


// session 3
function setScore(newScore) {
  score = newScore;
  score_display.textContent = "Score: " + score;
}


function applyGravity() {
  bird_dy += gravity;
  let birdTop = bird.offsetTop + bird_dy;

  birdTop = Math.max(birdTop, 0);
  birdTop = Math.min(birdTop, game_container.offsetHeight - bird.offsetHeight);
  bird.style.top = birdTop + "px";
}

function startGame() {
  if (gameInterval !== null) return;

  gameInterval = setInterval(() => {
    applyGravity();
    movePipes();
    checkCollision();

    frame++;

    // Every 200 frames (~2 seconds), create new pipe
    if (frame % frame_time === 0) {
      createPipe();
    }
  }, 10);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    if (game_state !== "Play") {
      game_state = "Play";
      startGame();
    }
    bird_dy -= 7;
  }
});


function onStartButtonClick() {
  if (game_state !== "Play") game_state = "Play";
  startGame();
}

function createPipe() {
  let pipe_position =
    Math.floor(Math.random() * (game_container.offsetHeight - pipe_gap - 100)) +
    50;
  let top_pipe = document.createElement("div");
  top_pipe.className = "top pipe";
  top_pipe.style.height = pipe_position + "px";
  top_pipe.style.top = "0px";
  top_pipe.style.left = "100%";
  game_container.appendChild(top_pipe);
  //bottom pipe

  let bottom_pipe = document.createElement("div");
  bottom_pipe.className = " bottom pipe";
  bottom_pipe.style.height =
    game_container.offsetHeight - pipe_gap - pipe_position + "px";
  bottom_pipe.style.bottom = "0px";
  bottom_pipe.style.left = "100%";
  game_container.appendChild(bottom_pipe);

  pipes.push(top_pipe, bottom_pipe);
}

function movePipes() {
  for (let pipe of pipes) {
    pipe.style.left = pipe.offsetLeft - 3 + "px";

    // Remove pipes off screen
    if (pipe.offsetLeft < -pipe.offsetWidth) {
      pipe.remove();
    }
  }

  // Remove old pipes from the array
  pipes = pipes.filter((pipe) => pipe.offsetLeft + pipe.offsetWidth > 0);
}


function checkCollision() {
  let birdRect = bird.getBoundingClientRect();
  for (let pipe of pipes) {
    let pipeRect = pipe.getBoundingClientRect();

    if (
      birdRect.left < pipeRect.left + pipeRect.width &&
      birdRect.left + birdRect.width > pipeRect.left &&
      birdRect.top < pipeRect.top + pipeRect.height &&
      birdRect.top + birdRect.height > pipeRect.top
    ) {
      endGame();
      return;
    }
  }
  // Collision with top and bottom
  if (
    bird.offsetTop <= 0 ||
    bird.offsetTop >= game_container.offsetHeight - bird.offsetHeight
  ) {
    endGame();
  }
  // Increase score when bird passes pipes (pipes are paired)
  pipes.forEach((pipe, index) => {
    if (index % 2 === 0) {
      // Only check once for each top-bottom pair
      if (
        pipe.offsetLeft + pipe.offsetWidth < bird.offsetLeft &&
        !pipe.passed
      ) {
        pipe.passed = true;
        setScore(score + 1);
      }
    }
  });
}

// End game
function endGame() {
  clearInterval(gameInterval);
  gameInterval = null;

  alert("Game Over! Your Score: " + score);
  resetGame();
}

// Reset game
function resetGame() {
  bird.style.top = "50%";
  bird_dy = 0;
  for (let pipe of pipes) {
    pipe.remove();
  }
  pipes = [];
  setScore(0);
  frame = 0;
  game_state = "Start";
  score_display.textContent = "";
}

// Start button
start_btn.addEventListener("click", () => {
  if (game_state !== "Play") {
    game_state = "Play";
    startGame();
  }
});