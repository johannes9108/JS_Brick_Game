export default class Paddle {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.width = 150;
    this.height = 30;
    this.maxSpeed = 10;
    this.currentSpeed = 0;
    this.position = {
      x: game.gameWidth / 2 - this.width / 2,
      y: game.gameHeight - this.height - 10
    };
  }

  draw(ctx) {
    ctx.fillStyle = "#f00";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(deltaTime) {
    this.position.x += this.currentSpeed;
    if (this.position.x < 0) this.position.x = 0;
    if (this.position.x + this.width > this.gameWidth)
      this.position.x = this.gameWidth - this.width;
  }
  moveLeft() {
    this.currentSpeed = -this.maxSpeed;
  }
  moveRight() {
    this.currentSpeed = this.maxSpeed;
  }
  stop() {
    this.currentSpeed = 0;
  }
}
