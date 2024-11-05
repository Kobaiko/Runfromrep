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

function showGameOverScreen(score) {
  finalScoreElement.textContent = ` ${score}`;
  gameOverScreen.classList.remove('hidden');
}

async function init() {
  try {
    // Show loading state
    startButton.style.display = 'none';
    const loadingText = document.createElement('p');
    loadingText.textContent = 'Loading...';
    splashScreen.appendChild(loadingText);

    assets = await loadAssets();
    
    if (!assets || !assets.playerSprites || assets.playerSprites.length === 0) {
      throw new Error('Failed to load player sprites');
    }

    // Create game instance
    game = new Game(canvas, ctx, assets, showGameOverScreen);

    // Set backgrounds only if assets loaded successfully
    if (assets.splashScreen) {
      splashScreen.style.backgroundImage = `url(${assets.splashScreen.src})`;
    }
    if (assets.instructionsScreen) {
      instructionsScreen.style.backgroundImage = `url(${assets.instructionsScreen.src})`;
    }
    if (assets.gameOverScreen) {
      gameOverScreen.style.backgroundImage = `url(${assets.gameOverScreen.src})`;
    }
    
    // Set button images
    if (assets.startButton) {
      startButton.style.backgroundImage = `url(${assets.startButton.src})`;
    }
    if (assets.playButton) {
      playButton.style.backgroundImage = `url(${assets.playButton.src})`;
    }
    if (assets.restartButton) {
      restartButton.style.backgroundImage = `url(${assets.restartButton.src})`;
    }

    // Remove loading text and show start button
    splashScreen.removeChild(loadingText);
    startButton.style.display = 'block';

    // Add event listeners
    startButton.addEventListener('click', showInstructions);
    playButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Show splash screen
    splashScreen.classList.remove('hidden');
  } catch (error) {
    console.error('Game initialization failed:', error);
    // Show error message to user
    const errorMessage = document.createElement('p');
    errorMessage.textContent = 'Failed to load game resources. Please refresh the page.';
    errorMessage.style.color = 'red';
    splashScreen.appendChild(errorMessage);
  }
}

function handleKeyDown(e) {
  if (e.code === 'Space' && game) {
    e.preventDefault();
    game.handleKeyDown(e.code);
  }
}

function handleKeyUp(e) {
  if (e.code === 'Space' && game) {
    game.handleKeyUp(e.code);
  }
}

function showInstructions() {
  splashScreen.classList.add('hidden');
  instructionsScreen.classList.remove('hidden');
}

function startGame() {
  instructionsScreen.classList.add('hidden');
  if (game) {
    game.start();
  }
}

function restartGame() {
  gameOverScreen.classList.add('hidden');
  if (game) {
    game.start();
  }
}

init();