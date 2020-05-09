import Paddle from "./paddle";
import InputHandler from "./input";
import Ball from "./ball";
import Brick from "./brick";
import { buildLevel, level1, level2 } from "./levels";

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  WINNING: 5
};
export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.gamestate = GAMESTATE.MENU;
    this.ball = new Ball(this);
    this.paddle = new Paddle(this);
    this.bricks = [];

    this.lives = 2;
    this.gameObjects = [];
    new InputHandler(this.paddle, this);

    this.levels = [level1, level2];
    this.currentLevel = 0;
  }

  start() {
    if (
      this.gamestate !== GAMESTATE.MENU &&
      this.gamestate !== GAMESTATE.NEWLEVEL &&
      this.gamestate !== GAMESTATE.WINNING
    )
      return;
    if (this.gamestate === GAMESTATE.WINNING) this.currentLevel = 0;
    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    this.ball.reset();
    this.gameObjects = [this.ball, this.paddle];
    this.gamestate = GAMESTATE.RUNNING;
  }

  update(deltaTime) {
    if (this.lives === 0) this.gamestate = GAMESTATE.GAMEOVER;
    if (
      this.gamestate === GAMESTATE.PAUSED ||
      this.gamestate === GAMESTATE.MENU ||
      this.gamestate === GAMESTATE.GAMEOVER ||
      this.gamestate === GAMESTATE.WINNING
    )
      return;
    [...this.gameObjects, ...this.bricks].forEach(brick =>
      brick.update(deltaTime)
    );
    this.bricks = this.bricks.filter(object => !object.markedForDeletion);
    if (this.bricks.length === 0) {
      this.currentLevel++;
      this.gamestate = GAMESTATE.NEWLEVEL;
      console.log("LVL " + this.currentLevel);
      if (this.currentLevel === this.levels.length) {
        this.gamestate = GAMESTATE.WINNING;
      } else {
        this.start();
      }
    }
  }

  draw(ctx) {
    [...this.gameObjects, ...this.bricks].forEach(object => object.draw(ctx));

    if (this.gamestate === GAMESTATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";

      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gamestate === GAMESTATE.MENU) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";

      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(
        "Press SPACEBAR To Start",
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    }
    if (this.gamestate === GAMESTATE.GAMEOVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";

      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gamestate === GAMESTATE.WINNING) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";

      ctx.fill();

      ctx.font = "20px Arial";
      ctx.fillStyle = "gainsboro";
      ctx.textAlign = "center";
      ctx.fillText("CONGRATULATIONS", this.gameWidth / 2, this.gameHeight / 2);
      ctx.fillText(
        "Press SPACEBAR To Start",
        this.gameWidth / 2,
        this.gameHeight / 2 + 20
      );
    }
  }

  togglePause() {
    console.log(this.gamestate);
    if (this.gamestate === GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }
}
