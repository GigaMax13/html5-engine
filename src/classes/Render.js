import Canvas from './Canvas';

// const AsyncFunction = (async function(){}).constructor;

class Render {
  #context;
  #buffer;

  constructor(context) {
    this.#context = context;
    this.#buffer = {};
  }

  clear = (x, y, w, h) => {
    this.#context.clearRect(x, y, w, h);
  };

  write = ({
    text,
    x,
    y,
    fontWeight = 'normal',
    fontFamily = 'Verdana',
    fontSize = 16,
    baseLine = 'alphabetic',
    color = '#000',
  }) => {
    this.#context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    this.#context.textBaseline = baseLine;

    this.#context.fillStyle = color;
    this.#context.fillText(text, x, y + fontSize);
    // Math.ceil(this.#context.measureText(text).width)
  };

  createImageBuffer = ({ width, height, name }) => async (transform) => {
    try {
      if (!name || name.constructor !== String) {
        throw new Error('The property `name` must be a valid String! i.e. { name: "..." }');
      }
      if (!width || width.constructor !== Number || width < 0) {
        throw new Error('The property `width` must be a positive Number i.e. { width: 100 }');
      }
      if (!height || height.constructor !== Number || height < 0) {
        throw new Error('The property `width` must be a positive Number i.e. { height: 100 }');
      }
      /* || (transform.constructor !== Function && transform.constructor !== AsyncFunction) */
      if (!transform) {
        throw new Error('The parameter `transform` must be a valid function! i.e. () => { ... }');
      }

      const canvas = Canvas({ width, height });

      await transform(canvas.context);

      this.#buffer[name] = await canvas.image;
    } catch (e) {
      console.error(e);
    }
  };

  deleteImageBuffer = (name) => {
    try {
      if (!this.#buffer[name]) {
        throw new Error(`The image buffer ${name} does not exist!`);
      }

      this.#buffer[name] = null;
      delete this.#buffer[name];
    } catch (e) {
      console.error(e);
    }
  };

  drawImageBuffer = (name, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) => {
    if (this.#buffer[name]) {
      this.#context.drawImage(this.#buffer[name], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
  };
}

export default (context) => new Render(context);
