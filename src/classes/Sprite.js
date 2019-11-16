import store from '../store/store';
import { Creators } from '../store/modules/Sprites';

import { convertToImage } from '../utils/Functions';

export default class Sprite {
  static addSprite = async ({
    name,
    width,
    height,
    source,
    frame: { rate, map, sequence } = {},
  }) => {
    const { sprites } = store.getState();
    const sourceTypes = [
      HTMLCanvasElement,
      HTMLImageElement,
      HTMLVideoElement,
      SVGImageElement,
      OffscreenCanvas,
      ImageBitmap,
      String,
    ];

    try {
      if (!name || name.constructor !== String) {
        throw new Error('The property `name` must be a valid String! i.e. { name: "..." }');
      }
      if (sprites[name]) {
        throw new Error(`A Sprite with that name \`${name}\` already exists!`);
      }
      if (width !== undefined && (width.constructor !== Number || width < 0)) {
        throw new Error('The property `width` must be a positive Number i.e. { width: 100 }');
      }
      if (height !== undefined && (height.constructor !== Number || height < 0)) {
        throw new Error('The property `width` must be a positive Number i.e. { height: 100 }');
      }

      if (!source || !sourceTypes.includes(source.constructor)) {
        throw new Error(`
          The property \`source\` must be a valid Image! i.e:
          Native Image Type:
          '(CSSImageValue or HTMLImageElement or SVGImageElement or HTMLVideoElement or HTMLCanvasElement or ImageBitmap or OffscreenCanvas)'\n
          Base64 String Image:
          \`data:image/png;base64,...\`
        `);
      }

      let sourceImage = source;

      if (source.constructor === String) {
        sourceImage = await convertToImage(source);
      }

      store.dispatch(Creators.addSprite({
        name,
        width,
        height,
        source: sourceImage,
      }));
    } catch (e) {
      console.error(e);
    }
  };

  static getSprite = (name) => {
    try {
      const { sprites } = store.getState();

      if (!sprites || !sprites[name]) {
        throw new Error(`Cant find the Sprite \`${name}\`.`);
      }

      const {
        width,
        height,
        source: image,
      } = sprites[name];

      return {
        image,
        width,
        height,
      };
    } catch (e) {
      console.error(e);
    }

    return {};
  };
}
