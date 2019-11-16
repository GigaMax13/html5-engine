import Canvas from './Canvas';

const AsyncFunction = (async function(){}).constructor;

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

  createImageBuffer = config => (render) => {
    try{
      if(!config || !Object.keys(config).length) {
        throw new Error('The parameter `config` must be a valid object! i.e. { [key]: value }');
      }

      const {
        width,
        height,
        name,
      } = config;

      if(!config.name || config.name.constructor !== String) {
        throw new Error('The parameter `config` must have a `name` property! i.e. { name: "..." }');
      }
      if(!config.width || config.width.constructor !== Number) {
        throw new Error('The parameter `config` must have a `width` property! i.e. { width: 100 }');
      }
      if(!config.height || config.height.constructor !== Number) {
        throw new Error('The parameter `config` must have a `height` property! i.e. { height: 100 }');
      }
      if(!render/* || (render.constructor !== Function && render.constructor !== AsyncFunction)*/) {
        throw new Error('The parameter `render` must be a valid function! i.e. () => { ... }');
      }

      const canvas = Canvas({ width, height });

      render(canvas.context);

      setTimeout(async () => {
        this.#buffer[name] = await canvas.image;
      }, 1e3);
    }catch(e){
      throw new Error(e);
    }
  };

  deleteImageBuffer = (name) => {
    try{
      if(!this.#buffer[name]) {
        throw new Error(`The image buffer ${name} does not exist!`);
      }

      this.#buffer[name] = null;
      delete this.#buffer[name];
    }catch(e){
      throw new Error(e);
    }
  };

  drawImageBuffer = (name, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) => {
    if(this.#buffer[name]) {
      this.#context.drawImage(this.#buffer[name], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
  };
}

export default (context) => new Render(context);
