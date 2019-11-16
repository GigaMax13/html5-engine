import Canvas from './Canvas';
import Render from './Render';
import Sprite from './Sprite';

class Game {
  #delayTime;
  #isRunning;
  #entities;
  #canvas;
  #render;
  #update;

  constructor(element, width = window.innerWidth, height = window.innerHeight) {
    this.#canvas = Canvas({ element, width, height });
    this.#render = Render(this.#canvas.context);

    this.#isRunning = false;
    this.#entities = {};
  }

  start = () => {
    if (!this.#isRunning) {
      this.#isRunning = true;

      this.#gameLoop();
    }
  };

  addSprite = async ({
    name,
    width,
    height,
    source,
  }) => Sprite.addSprite({
    name,
    width,
    height,
    source,
  });

  getSprite = (name) => Sprite.getSprite(name);

  addEntity = ({ name, width, height, x, y, visible }, render) => {
    this.#entities[name] = {
      visible,
      width,
      height,
      x,
      y,
    };
    this.#render.createImageBuffer({ name, width, height })(render);
  };

  remEntity = name => this.#render.deleteImageBuffer(name);

  moveEntity = name => move => {
    const { x, y } = this.#entities[name];

    const {
      x: newX,
      y: newY,
    } = move({ x, y });

    this.#entities[name] = {
      ...this.#entities[name],
      x: newX !== undefined ? newX : x,
      y: newY !== undefined ? newY : y,
    };
  };

  update = update => {
    this.#update = () => update(this.#delayTime);
  };

  #gameLoop = (maxFPS = 60) => {
    // Simulate 1000 ms / 60 FPS = 16.667 ms per frame every time we run update()
    this.#delayTime = 1000 / 60;
    // The last time the frame was updated
    let lastFrameTimeMs = 0;
    let delta = 0;

    const loop = (timestamp) => {
      // Throttle the frame rate.
      if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        requestAnimationFrame(loop);

        return;
      }

      delta += timestamp - lastFrameTimeMs;
      lastFrameTimeMs = timestamp;

      while (delta >= this.#delayTime) {
        // update our game logic before draw things to canvas
        this.#update();
        delta -= this.#delayTime;
      }

      // Call draw function to draw our logo to canvas
      this.#draw();

      // Call loop recursively
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  };

  #draw = () => {
    this.#render.clear(0, 0, this.#canvas.width, this.#canvas.height);

    Object.keys(this.#entities).forEach((name) => {
      this.#drawEntity(name);
    });
  };

  #drawEntity = (name) => {
    const {
      visible,
      width,
      height,
      x,
      y,
    } = this.#entities[name];
    if (visible) {
      this.#render.drawImageBuffer(name, 0, 0, width, height, x, y, width, height);
    }
  };
}

/**
 * Creates a game instance
 * @constructor
 * @param {HTMLCanvasElement} element
 * @param {number} width
 * @param {number} height
 * @return {Game}
 */
export default (element, width, height) => {
  try {
    if (!element || element.constructor !== HTMLCanvasElement) {
      throw new Error('The parameter `element` must be a valid HTMLCanvasElement! i.e. <canvas/>');
    }

    if (width !== undefined && (width.constructor !== Number || width <= 0)) {
      throw new Error('The parameter `width` must be a positive Number!');
    }

    if (height !== undefined && (height.constructor !== Number || height <= 0)) {
      throw new Error('The parameter `height` must be a positive Number!');
    }

    return new Game(element, width, height);
  } catch (e) {
    console.error(e);
  }

  return {};
};
