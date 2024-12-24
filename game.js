const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Sound effects
const moveSound = new Audio('move.mp3');
const foodSound = new Audio('music_food.mp3');
const gameOverSound = new Audio('gameover.mp3');

// Game constants
const GRID_SIZE = 20;
const GAME_SPEED = 100;
const CANVAS_SIZE = 600;

// Game state
let snake = [
    { x: 300, y: 300 }, // Head
    { x: 280, y: 300 }, // Body
    { x: 260, y: 300 }, // Tail
];
let direction = 'right';
let food = generateFood();
let score = 0;
let gameLoop;

// Load high score from localStorage
let highScore = localStorage.getItem('snakeHighScore') || 0;
highScoreElement.textContent = highScore;

// Initialize game
function init() {
    document.addEventListener('keydown', handleKeyPress);
    gameLoop = setInterval(update, GAME_SPEED);
    // Start background music when game starts
    const backgroundMusic = document.querySelector('.background-music');
    backgroundMusic.volume = 0.3;  // Lower volume for background music
    backgroundMusic.play();
}

// Main game update function
function update() {
    moveSnake();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    if (checkFoodCollision()) {
        score += 10;
        scoreElement.textContent = score;
        foodSound.play();
        food = generateFood();
        // Don't remove tail to make snake grow
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
    
    draw();
}

// Draw game elements
function draw() {
    // Clear canvas
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#10B981';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, GRID_SIZE - 2, GRID_SIZE - 2);
    });
    
    // Draw food
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(food.x, food.y, GRID_SIZE - 2, GRID_SIZE - 2);
}

// Move snake based on current direction
function moveSnake() {
    const head = { ...snake[0] };
    
    switch(direction) {
        case 'up':
            head.y -= GRID_SIZE;
            break;
        case 'down':
            head.y += GRID_SIZE;
            break;
        case 'left':
            head.x -= GRID_SIZE;
            break;
        case 'right':
            head.x += GRID_SIZE;
            break;
    }
    
    snake.unshift(head);
}

// Handle keyboard input
function handleKeyPress(event) {
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                direction = 'up';
                moveSound.play();
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                direction = 'down';
                moveSound.play();
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                direction = 'left';
                moveSound.play();
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                direction = 'right';
                moveSound.play();
            }
            break;
    }
}

// Generate new food position
function generateFood() {
    const x = Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE;
    const y = Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE;
    return { x, y };
}

// Check for collisions
function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= CANVAS_SIZE || 
        head.y < 0 || head.y >= CANVAS_SIZE) {
        return true;
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Check if snake ate food
function checkFoodCollision() {
    const head = snake[0];
    return head.x === food.x && head.y === food.y;
}

// Game over handling
function gameOver() {
    clearInterval(gameLoop);
    // Stop background music
    const backgroundMusic = document.querySelector('.background-music');
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    gameOverSound.play();
    // Update high score if current score is higher
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreElement.textContent = highScore;
    }
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.textContent = score;
}

// Restart game
function restartGame() {
    snake = [
        { x: 300, y: 300 },
        { x: 280, y: 300 },
        { x: 260, y: 300 },
    ];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    food = generateFood();
    gameOverScreen.classList.add('hidden');
    // Restart background music
    const backgroundMusic = document.querySelector('.background-music');
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    gameLoop = setInterval(update, GAME_SPEED);
}

// Start the game
init();

// Music Controls
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🔈 Music';
    } else {
        bgMusic.play();
        musicToggle.textContent = '🔊 Music';
    }
    isMusicPlaying = !isMusicPlaying;
}); 