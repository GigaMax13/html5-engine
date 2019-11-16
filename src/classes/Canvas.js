class Canvas {
  #canvas;
  #context;

  constructor(element, width, height) {
    this.#canvas = element;
    this.#canvas.width = width;
    this.#canvas.height = height;
    this.#context = this.#canvas.getContext('2d');
  }

  get context() {
    return this.#context;
  }

  get image() {
    return (new Promise((resolve, reject) => {
      const image = new Image();
      image.width = this.#canvas.width;
      image.height = this.#canvas.height;
      image.onload = () => {
        resolve(image);
      };
      image.onerror = (error) => {
        reject(error);
      };
      image.src = this.#canvas.toDataURL('image/png');
    }));
  }

  get width() {
    return this.#canvas.width;
  }

  get height() {
    return this.#canvas.height;
  }
}

export default ({ element = document.createElement("canvas"), width, height }) => {
  try {
    if (element && element.constructor !== HTMLCanvasElement) {
      throw new Error('The parameter `element` must be a valid HTMLCanvasElement! i.e. <canvas />');
    }

    return new Canvas(element, width, height);
  } catch (e) {
    throw new Error(e);
  }
};
