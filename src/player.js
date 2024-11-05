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
    this.gravity = 0.6;
    this.jumpStrength = -15;
    this.isJumping = false;
    this.jumpCooldown = 0;
  }

  update() {
    this.velocityY += this.gravity;
    this.y += this.velocityY;

    const groundLevel = 600 - 50 - this.height; // Adjust this value based on your game's ground level
    if (this.y > groundLevel) {
      this.y = groundLevel;
      this.velocityY = 0;
      this.isJumping = false;
    }

    if (this.jumpCooldown > 0) {
      this.jumpCooldown--;
    }

    // Update animation frame
    if (!this.isJumping) {
      this.animationCounter++;
      if (this.animationCounter >= this.animationSpeed) {
        this.currentFrame = (this.currentFrame + 1) % 5 + 1; // Cycle through frames 1-5
        this.animationCounter = 0;
      }
    } else {
      this.currentFrame = 0; // Use standing frame while jumping
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
    return (
      this.x < object.x + object.width &&
      this.x + this.width > object.x &&
      this.y < object.y + object.height &&
      this.y + this.height > object.y
    );
  }

  // Add this reset method
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
    // Check if the player's y position is less than the obstacle's y position
    return this.y < obstacle.y; // Assuming obstacle has a y property
  }
}
