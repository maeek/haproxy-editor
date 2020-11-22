import path from 'path';
import FileHandler from '../util/file';

const CONFIG_DIR: string = process.env.CONFIG_DIR ? path.join(__dirname, process.env.CONFIG_DIR) : path.join(__dirname, '../../../haproxy-configs/');

export const getConfigFile = (requestedFileName: string) => new Promise<string>((resolve, reject) => {
  const fileName = FileHandler.sanitize(requestedFileName);

  const file = new FileHandler(path.join(CONFIG_DIR, fileName));
  try {
    file.load((content: string) => {
      if (!content) reject();

      resolve(content);
    });
  } catch (e) {
    reject(e);
  }
});

export const setConfigFile = (requestedFileName: string, data: string) => new Promise<undefined>((resolve, reject) => {
  const fileName = FileHandler.sanitize(requestedFileName);

  const file = new FileHandler(path.join(CONFIG_DIR, fileName));
  try {
    file.save(data, (success: boolean) => {
      if (!success) reject();
      resolve();
    });
  } catch (e) {
    reject();
  }
});

export const rmConfigFile = (requestedFileName: string) => new Promise<undefined>((resolve, reject) => {
  const fileName = FileHandler.sanitize(requestedFileName);

  const file = new FileHandler(path.join(CONFIG_DIR, fileName));
  try {
    file.delete((success: boolean) => {
      if (!success) reject();

      resolve();
    });
  } catch (e) {
    reject();
  }
});
