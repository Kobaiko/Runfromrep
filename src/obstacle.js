export default class Obstacle {
  constructor(x, y, type, sprite) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.type = type;
    this.sprite = sprite;
  }

  update(gameSpeed) {
    this.x -= gameSpeed;
  }

  draw(ctx) {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
}
