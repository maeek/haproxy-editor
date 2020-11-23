import path from 'path';

import { prepareErrorMessageJson } from '../util/error';
import FileHandler from '../util/file';

if (!process.env.APP_DIR) {
  process.env.APP_DIR = path.join(__dirname, '../../');
}

const CONFIG_DIR: string = process.env.CONFIG_DIR 
  ? process.env.CONFIG_DIR
  : path.join(process.env.APP_DIR, 'haproxy-configs/');

export const getConfigFile = (requestedFileName: string) => new Promise<string>((resolve, reject) => {
  const fileName = FileHandler.sanitizePath(requestedFileName);

  const file = new FileHandler(path.join(CONFIG_DIR, fileName));

  file.load()
    .then((content: string) => resolve(content))
    .catch((error: string) => reject(error));
});

export const setConfigFile = (requestedFileName: string, data: string) => new Promise<never>((resolve, reject) => {
  const fileName = FileHandler.sanitizePath(requestedFileName);

  const file = new FileHandler(path.join(CONFIG_DIR, fileName));

  file.save(data)
    .then(() => resolve())
    .catch((error: string) => reject(error));
});

export const rmConfigFile = (requestedFileName: string) => new Promise<never>((resolve, reject) => {
  const fileName = FileHandler.sanitizePath(requestedFileName);

  const file = new FileHandler(path.join(CONFIG_DIR, fileName));

  file.delete()
    .then(() => resolve())
    .catch((error: string) => reject(error));
});
