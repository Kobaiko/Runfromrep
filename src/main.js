import Game from './game.js';
import { loadAssets } from './assetLoader.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const playButton = document.getElementById('play-button');
const restartButton = document.getElementById('restart-button');
const splashScreen = document.getElementById('splash-screen');
const instructionsScreen = document.getElementById('instructions-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');

canvas.width = 800;
canvas.height = 600;

let game;
let assets;

async function init() {
  try {
    console.log('Starting asset loading...');
    assets = await loadAssets();
    console.log('Assets loaded successfully');

    game = new Game(canvas, ctx, assets, showGameOverScreen);

    // Set backgrounds
    splashScreen.style.backgroundImage = `url(${assets.splashScreen.src})`;
    instructionsScreen.style.backgroundImage = `url(${assets.instructionsScreen.src})`;
    gameOverScreen.style.backgroundImage = `url(${assets.gameOverScreen.src})`;
    
    // Set button images
    startButton.style.backgroundImage = `url(${assets.startButton.src})`;
    playButton.style.backgroundImage = `url(${assets.playButton.src})`;
    restartButton.style.backgroundImage = `url(${assets.restartButton.src})`;

    startButton.addEventListener('click', showInstructions);
    playButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Show the splash screen
    splashScreen.classList.remove('hidden');
    console.log('Initialization complete');
  } catch (error) {
    console.error('Failed to initialize the game:', error);
    alert(`Failed to initialize the game: ${error.message}\nPlease check the console for more details.`);
  }
}

function handleKeyDown(e) {
  if (e.code === 'Space' && game && !game.isGameOver) {
    e.preventDefault();
    game.handleKeyDown(e.code);
  }
}

function handleKeyUp(e) {
  if (e.code === 'Space' && game && !game.isGameOver) {
    game.handleKeyUp(e.code);
  }
}

function showInstructions() {
  splashScreen.classList.add('hidden');
  instructionsScreen.classList.remove('hidden');
}

function startGame() {
  instructionsScreen.classList.add('hidden');
  game.start();
}

function restartGame() {
  gameOverScreen.classList.add('hidden');
  game.start();
}

function showGameOverScreen(score) {
  finalScoreElement.textContent = score;
  gameOverScreen.classList.remove('hidden');
}

init();
