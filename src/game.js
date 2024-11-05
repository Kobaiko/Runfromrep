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
        this.player = new Player(50, this.canvas.height - 150, assets.playerSprites);
        this.parallaxBackground = new ParallaxBackground(
            assets.backgroundImage,
            assets.groundImage,
            canvas.width,
            canvas.height,
            2
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
        this.hasJumpedOverObstacle = false; // Flag to track if the player has jumped over an obstacle

        // Define ground level based on player position
        this.GROUND_LEVEL = this.canvas.height - 150; // Adjust this value based on your player sprite height

        // Prepare background music
        this.assets.backgroundMusic.loop = true;

        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
    }

    spawnObjects() {
        this.spawnTimer++;
        this.pointAssetTimer++;

        // Randomize the spawn interval for obstacles
        if (this.spawnTimer >= Math.floor(Math.random() * 60) + 60) { // Random interval between 60 and 120 frames
            this.spawnTimer = 0;
            this.spawnObstacle();
        }

        // Randomize the spawn interval for collectibles
        if (this.pointAssetTimer >= Math.floor(Math.random() * 300) + 200) {
            this.pointAssetTimer = 0;
            const rand = Math.random();

            // Use ground level for collectibles
            const spawnY = this.GROUND_LEVEL; // Set y position to ground level

            // Randomize the x position for collectibles
            const spawnX = this.canvas.width; // X position for spawning

            // Check for overlapping with existing obstacles
            let canSpawn = true;

            // Check obstacles
            this.obstacles.forEach(obstacle => {
                if (this.isOverlapping(spawnX, spawnY, 30, 30, obstacle)) {
                    canSpawn = false; // Set flag to false if overlap detected
                }
            });

            // If collectibles are allowed to spawn, ensure they are not behind obstacles
            if (canSpawn) {
                if (rand < 0.4) {
                    this.spawnCollectible('rabbi', spawnX, spawnY);
                } else if (rand < 0.8) {
                    this.spawnCollectible('channel14', spawnX, spawnY);
                } else {
                    this.spawnCollectible('coin', spawnX, spawnY);
                }
            }
        }
    }

    spawnObstacle() {
        const types = ['sign', 'barrel', 'judge'];
        const type = types[Math.floor(Math.random() * types.length)];

        // Use ground level for obstacles
        const spawnY = this.GROUND_LEVEL; // Set y position to ground level

        if (this.canvas.width - this.lastObstacleX >= this.minObstacleDistance) {
            const obstacle = new Obstacle(this.canvas.width, spawnY, type, this.assets[`${type}Sprite`]);
            this.obstacles.push(obstacle);
            this.lastObstacleX = obstacle.x;
        }
    }

    // Modify the spawnCollectible method to accept x and y parameters
    spawnCollectible(type, spawnX, spawnY) {
        // Check for overlapping with existing obstacles
        let canSpawn = true;

        this.obstacles.forEach(obstacle => {
            if (this.isOverlapping(spawnX, spawnY, 30, 30, obstacle)) {
                canSpawn = false; // Set flag to false if overlap detected
            }
        });

        // If no overlap, spawn the collectible
        if (canSpawn) {
            if (type === 'rabbi') {
                const rabbi = new Rabbi(spawnX, spawnY, this.assets.rabbiSprite);
                this.rabbis.push(rabbi);
            } else if (type === 'channel14') {
                const channel14 = new Channel14(spawnX, spawnY, this.assets.channel14Sprite);
                this.channel14s.push(channel14);
            } else if (type === 'coin') {
                const coin = new Coin(spawnX, spawnY, this.assets.coinSprite);
                this.coins.push(coin);
            }
        }
    }

    isOverlapping(x, y, width, height, object) {
        return (
            x < object.x + object.width &&
            x + width > object.x &&
            y < object.y + object.height &&
            y + height > object.y
        );
    }

    gameLoop() {
        // Update game state, draw everything, etc.
        // Call this method recursively using requestAnimationFrame
    }

    // Other methods for handling game logic, rendering, etc.
}
