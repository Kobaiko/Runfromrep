export default class ParallaxBackground {
  constructor(backgroundImage, groundImage, canvasWidth, canvasHeight, speed, groundHeight) {
    this.backgroundImage = backgroundImage;
    this.groundImage = groundImage;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.speed = speed;
    this.groundHeight = groundHeight || 100; // Default to 100px if not specified
    this.backgroundX = 0;
    this.groundX = 0;
  }

  update() {
    this.backgroundX -= this.speed * 0.5;
    this.groundX -= this.speed;

    if (this.backgroundX <= -this.canvasWidth) {
      this.backgroundX = 0;
    }

    if (this.groundX <= -this.canvasWidth) {
      this.groundX = 0;
    }
  }

  draw(ctx) {
    // Draw background
    ctx.drawImage(this.backgroundImage, this.backgroundX, 0, this.canvasWidth, this.canvasHeight);
    ctx.drawImage(this.backgroundImage, this.backgroundX + this.canvasWidth, 0, this.canvasWidth, this.canvasHeight);

    // Draw ground at the bottom with specified height
    const groundY = this.canvasHeight - this.groundHeight;
    ctx.drawImage(this.groundImage, this.groundX, groundY, this.canvasWidth, this.groundHeight);
    ctx.drawImage(this.groundImage, this.groundX + this.canvasWidth, groundY, this.canvasWidth, this.groundHeight);
  }
}