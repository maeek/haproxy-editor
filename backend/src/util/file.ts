import fs from 'fs';
import path from 'path';

import logger from './log';

export default class FileHandler {
  _path: string;
  contents: string = '';

  constructor(path: string) {
    this._path = path;

    return this;
  }

  static sanitizePath(unsafePath: string) {
    return path.normalize(unsafePath).replace(/(\.\.(\/)+)+/g, '');
  }

  load(path?: string): Promise<string> {
    const pathToLoad = path || this._path;
    return new Promise((resolve, reject) => {
      fs.readFile(pathToLoad, { encoding: 'utf8' }, (err, data) => {
        if (err) {
          logger.error(`File open: ${pathToLoad}, error: ${err}`, err);
          reject(err.message);
        }

        this.contents = data;
        logger.log(`File open: ${pathToLoad}`);
        resolve(data);
      });
    });
  }

  save(data?: string): Promise<string | undefined> {
    const dataToSave = data ? data : this.contents;
    return new Promise((resolve, reject) => {
      fs.writeFile(this._path, dataToSave, { encoding: 'utf8' }, (err) => {
        if (err) {
          logger.error(`File write: ${this._path}, error: ${err}`, err);
          reject(err.message);
        } 

        this.contents = dataToSave;
        logger.log(`File write: ${this._path}`);
        resolve();
      });
    });
  }

  delete(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      fs.unlink(this._path, (err) => {
        if (err) {
          logger.error(`File remove: ${this._path}, error: ${err}`, err);
          reject(err.message);
        }

        this.contents = '';
        logger.log(`File remove: ${this._path}`);
        resolve();
      });
    });
  }

}
