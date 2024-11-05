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
        this.GROUND_HEIGHT = 100; // Ground height is 100px
        this.GROUND_LEVEL = this.canvas.height - this.GROUND_HEIGHT; // Ground level is at the top of the ground image
        this.player = new Player(50, this.GROUND_LEVEL - 100, assets.playerSprites); // Position player just above ground
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
        this.pointAssetTimer = 0;
        this.lastObstacleX = 0;
        this.minObstacleDistance = 400;
        this.isGameOver = false;
        this.keys = {};
        this.hasJumpedOverObstacle = false;

        this.assets.backgroundMusic.loop = true;
        this.gameLoop = this.gameLoop.bind(this);
        this.animationFrameId = null;
    }

    start() {
        this.reset();
        this.assets.backgroundMusic.currentTime = 0;
        this.assets.backgroundMusic.play();
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
        this.pointAssetTimer = 0;
        this.lastObstacleX = 0;
        this.isGameOver = false;
        this.player = new Player(50, this.GROUND_LEVEL - 100, this.assets.playerSprites);
    }

    spawnObstacle() {
        const types = ['sign', 'barrel', 'judge'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        if (this.canvas.width - this.lastObstacleX >= this.minObstacleDistance) {
            const obstacle = new Obstacle(this.canvas.width, this.GROUND_LEVEL - 70, type, this.assets[`${type}Sprite`]);
            this.obstacles.push(obstacle);
            this.lastObstacleX = obstacle.x;
        }
    }

    spawnCollectible(type, spawnX) {
        if (type === 'rabbi') {
            const rabbi = new Rabbi(spawnX, this.GROUND_LEVEL - 70, this.assets.rabbiSprite);
            this.rabbis.push(rabbi);
        } else if (type === 'channel14') {
            const channel14 = new Channel14(spawnX, this.GROUND_LEVEL - 70, this.assets.channel14Sprite);
            this.channel14s.push(channel14);
        } else if (type === 'coin') {
            const coin = new Coin(spawnX, this.GROUND_LEVEL - 120, this.assets.coinSprite); // Coins slightly higher
            this.coins.push(coin);
        }
    }

    spawnObjects() {
        this.spawnTimer++;
        this.pointAssetTimer++;

        // Randomize between obstacles and collectibles
        if (this.spawnTimer >= Math.floor(Math.random() * 60) + 60) {
            this.spawnTimer = 0;
            const rand = Math.random();
            const spawnX = this.canvas.width;

            let canSpawn = true;
            this.obstacles.forEach(obstacle => {
                if (Math.abs(spawnX - obstacle.x) < 100) {
                    canSpawn = false;
                }
            });

            if (canSpawn) {
                if (rand < 0.4) {
                    this.spawnObstacle();
                } else if (rand < 0.7) {
                    this.spawnCollectible('rabbi', spawnX);
                } else if (rand < 0.9) {
                    this.spawnCollectible('channel14', spawnX);
                } else {
                    this.spawnCollectible('coin', spawnX);
                }
            }
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
        // Check obstacle collisions
        for (const obstacle of this.obstacles) {
            if (this.player.collidesWith(obstacle)) {
                this.isGameOver = true;
                this.assets.backgroundMusic.pause();
                this.onGameOver(this.score);
                return;
            }
        }

        // Check rabbi collisions
        for (let i = this.rabbis.length - 1; i >= 0; i--) {
            if (this.player.collidesWith(this.rabbis[i])) {
                this.rabbis.splice(i, 1);
                this.score += 100;
                this.assets.rabbiSound.currentTime = 0;
                this.assets.rabbiSound.play();
            }
        }

        // Check channel14 collisions
        for (let i = this.channel14s.length - 1; i >= 0; i--) {
            if (this.player.collidesWith(this.channel14s[i])) {
                this.channel14s.splice(i, 1);
                this.score += 50;
                this.assets.coinSound.currentTime = 0;
                this.assets.coinSound.play();
            }
        }

        // Check coin collisions
        for (let i = this.coins.length - 1; i >= 0; i--) {
            if (this.player.collidesWith(this.coins[i])) {
                this.coins.splice(i, 1);
                this.score += 10;
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

        // Update obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(this.gameSpeed);
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
            }
        }

        // Update rabbis
        for (let i = this.rabbis.length - 1; i >= 0; i--) {
            this.rabbis[i].update(this.gameSpeed);
            if (this.rabbis[i].x + this.rabbis[i].width < 0) {
                this.rabbis.splice(i, 1);
            }
        }

        // Update channel14s
        for (let i = this.channel14s.length - 1; i >= 0; i--) {
            this.channel14s[i].update(this.gameSpeed);
            if (this.channel14s[i].x + this.channel14s[i].width < 0) {
                this.channel14s.splice(i, 1);
            }
        }

        // Update coins
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
        
        // Draw background
        this.parallaxBackground.draw(this.ctx);
        
        // Draw score
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px "Press Start 2P"';
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);

        // Draw game elements
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