// eslint-disable-next-line import/prefer-default-export
export const convertToImage = (data) => (new Promise(((resolve, reject) => {
  const image = new Image();
  image.onload = () => {
    resolve(image);
  };
  image.onerror = (error) => {
    reject(error);
  };
  image.src = data;
})));
