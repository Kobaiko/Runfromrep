export default class Player {
    constructor(x, y, sprites) {
        this.initialX = x;
        this.initialY = y;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.sprites = sprites;
        this.currentFrame = 0;
        this.animationSpeed = 8;
        this.animationCounter = 0;
        this.velocityY = 0;
        this.gravity = 0.35;        // Further reduced gravity
        this.jumpStrength = -15;    // Increased jump strength
        this.isJumping = false;
        this.jumpCooldown = 0;
    }

    update() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        const groundLevel = 600 - 100;
        if (this.y > groundLevel - this.height) {
            this.y = groundLevel - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }

        if (this.jumpCooldown > 0) {
            this.jumpCooldown--;
        }

        if (!this.isJumping) {
            this.animationCounter++;
            if (this.animationCounter >= this.animationSpeed) {
                this.currentFrame = (this.currentFrame + 1) % 5 + 1;
                this.animationCounter = 0;
            }
        } else {
            this.currentFrame = 0;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.sprites[this.currentFrame], this.x, this.y, this.width, this.height);
    }

    jump() {
        if (!this.isJumping && this.jumpCooldown === 0) {
            this.velocityY = this.jumpStrength;
            this.isJumping = true;
            this.jumpCooldown = 10;
        }
    }

    collidesWith(object) {
        const hitboxPadding = 25;
        const playerHitbox = {
            x: this.x + hitboxPadding,
            y: this.y + hitboxPadding,
            width: this.width - (hitboxPadding * 2),
            height: this.height - (hitboxPadding * 2)
        };

        // Only check collision if we're not clearly above the obstacle
        if (this.velocityY > 0 && playerHitbox.y < object.y - playerHitbox.height) {
            return false;
        }

        return (
            playerHitbox.x < object.x + object.width &&
            playerHitbox.x + playerHitbox.width > object.x &&
            playerHitbox.y < object.y + object.height &&
            playerHitbox.y + playerHitbox.height > object.y
        );
    }

    reset() {
        this.x = this.initialX;
        this.y = this.initialY;
        this.velocityY = 0;
        this.isJumping = false;
        this.jumpCooldown = 0;
        this.currentFrame = 0;
        this.animationCounter = 0;
    }

    isAbove(obstacle) {
        return this.y + this.height < obstacle.y + 20;
    }
}