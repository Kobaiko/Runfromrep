import Player from './player.js';
import Obstacle from './obstacle.js';
import Rabbi from './rabbi.js';
import Channel14 from './channel14.js';
import Coin from './coin.js';
import ParallaxBackground from './parallaxBackground.js';

export default class Game {
    constructor(canvas, ctx, assets, onGameOver) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.assets = assets;
        this.onGameOver = onGameOver;
        this.GROUND_HEIGHT = 100;
        this.GROUND_LEVEL = this.canvas.height - this.GROUND_HEIGHT;
        this.player = new Player(50, this.GROUND_LEVEL - 100, assets.playerSprites);
        this.parallaxBackground = new ParallaxBackground(
            assets.backgroundImage,
            assets.groundImage,
            canvas.width,
            canvas.height,
            2,
            this.GROUND_HEIGHT
        );
        this.obstacles = [];
        this.rabbis = [];
        this.channel14s = [];
        this.coins = [];
        this.score = 0;
        this.gameSpeed = 2;
        this.spawnTimer = 0;
        this.lastSpawnTime = 0;
        this.minSpawnInterval = 120; // Minimum frames between spawns
        this.isGameOver = false;
        this.keys = {};

        this.assets.backgroundMusic.loop = true;
        this.gameLoop = this.gameLoop.bind(this);
        this.animationFrameId = null;
    }

    start() {
        this.reset();
        this.assets.backgroundMusic.currentTime = 0;
        this.assets.backgroundMusic.play();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.gameLoop();
    }

    reset() {
        this.obstacles = [];
        this.rabbis = [];
        this.channel14s = [];
        this.coins = [];
        this.score = 0;
        this.gameSpeed = 2;
        this.spawnTimer = 0;
        this.lastSpawnTime = 0;
        this.isGameOver = false;
        this.player = new Player(50, this.GROUND_LEVEL - 100, this.assets.playerSprites);
    }

    spawnObstacle() {
        const types = ['sign', 'barrel', 'judge'];
        const type = types[Math.floor(Math.random() * types.length)];
        const obstacle = new Obstacle(this.canvas.width, this.GROUND_LEVEL - 70, type, this.assets[`${type}Sprite`]);
        this.obstacles.push(obstacle);
    }

    spawnCollectible(type) {
        const spawnX = this.canvas.width;
        if (type === 'rabbi') {
            const rabbi = new Rabbi(spawnX, this.GROUND_LEVEL - 70, this.assets.rabbiSprite);
            this.rabbis.push(rabbi);
        } else if (type === 'channel14') {
            const channel14 = new Channel14(spawnX, this.GROUND_LEVEL - 70, this.assets.channel14Sprite);
            this.channel14s.push(channel14);
        } else if (type === 'coin') {
            const coin = new Coin(spawnX, this.GROUND_LEVEL - 120, this.assets.coinSprite);
            this.coins.push(coin);
        }
    }

    spawnObjects() {
        this.spawnTimer++;

        if (this.spawnTimer - this.lastSpawnTime >= this.minSpawnInterval) {
            const rand = Math.random();
            
            // 50% chance for obstacle, 50% for collectibles
            if (rand < 0.5) {
                this.spawnObstacle();
            } else {
                const collectibleRand = Math.random();
                if (collectibleRand < 0.4) {
                    this.spawnCollectible('rabbi');
                } else if (collectibleRand < 0.7) {
                    this.spawnCollectible('channel14');
                } else {
                    this.spawnCollectible('coin');
                }
            }
            
            this.lastSpawnTime = this.spawnTimer;
        }
    }

    handleKeyDown(code) {
        if (code === 'Space') {
            this.player.jump();
            this.assets.jumpSound.currentTime = 0;
            this.assets.jumpSound.play();
        }
    }

    handleKeyUp(code) {
        if (code === 'Space') {
            this.keys[code] = false;
        }
    }

    checkCollisions() {
        for (const obstacle of this.obstacles) {
            if (this.player.collidesWith(obstacle)) {
                this.isGameOver = true;
                this.assets.backgroundMusic.pause();
                this.onGameOver(this.score);
                return;
            }
        }

        for (let i = this.rabbis.length - 1; i >= 0; i--) {
            if (this.player.collidesWith(this.rabbis[i])) {
                this.rabbis.splice(i, 1);
                this.score += 5;
                this.assets.rabbiSound.currentTime = 0;
                this.assets.rabbiSound.play();
            }
        }

        for (let i = this.channel14s.length - 1; i >= 0; i--) {
            if (this.player.collidesWith(this.channel14s[i])) {
                this.channel14s.splice(i, 1);
                this.score += 5;
                this.assets.channel14Sound.currentTime = 0;
                this.assets.channel14Sound.play();
            }
        }

        for (let i = this.coins.length - 1; i >= 0; i--) {
            if (this.player.collidesWith(this.coins[i])) {
                this.coins.splice(i, 1);
                this.score += 5;
                this.assets.coinSound.currentTime = 0;
                this.assets.coinSound.play();
            }
        }
    }

    update() {
        if (this.isGameOver) return;

        this.player.update();
        this.parallaxBackground.update();
        this.spawnObjects();

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(this.gameSpeed);
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
            }
        }

        for (let i = this.rabbis.length - 1; i >= 0; i--) {
            this.rabbis[i].update(this.gameSpeed);
            if (this.rabbis[i].x + this.rabbis[i].width < 0) {
                this.rabbis.splice(i, 1);
            }
        }

        for (let i = this.channel14s.length - 1; i >= 0; i--) {
            this.channel14s[i].update(this.gameSpeed);
            if (this.channel14s[i].x + this.channel14s[i].width < 0) {
                this.channel14s.splice(i, 1);
            }
        }

        for (let i = this.coins.length - 1; i >= 0; i--) {
            this.coins[i].update(this.gameSpeed);
            if (this.coins[i].x + this.coins[i].width < 0) {
                this.coins.splice(i, 1);
            }
        }

        this.checkCollisions();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.parallaxBackground.draw(this.ctx);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px "Press Start 2P"';
        this.ctx.textAlign = 'right';
        const scoreText = `${this.score} :התוצאה שלך`;
        this.ctx.fillText(scoreText, this.canvas.width - 20, 40);
        this.ctx.textAlign = 'left';

        this.player.draw(this.ctx);
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        this.rabbis.forEach(rabbi => rabbi.draw(this.ctx));
        this.channel14s.forEach(channel14 => channel14.draw(this.ctx));
        this.coins.forEach(coin => coin.draw(this.ctx));
    }

    gameLoop() {
        if (!this.isGameOver) {
            this.update();
            this.draw();
            this.animationFrameId = requestAnimationFrame(this.gameLoop);
        }
    }
}