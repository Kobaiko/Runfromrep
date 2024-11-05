export default class Rabbi {
    constructor(x, y, sprite) {
        this.x = x;
        this.y = y;
        this.width = 70;  // Increased size
        this.height = 70; // Increased size
        this.sprite = sprite;
    }

    update(gameSpeed) {
        this.x -= gameSpeed;
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    }
}