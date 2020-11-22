import fs from 'fs';
import path from 'path';
import logger from './log';

export default class FileHandler {
  path: string;
  contents: string | Array<string> = '';
  error: NodeJS.ErrnoException | null = null;

  constructor(path: string) {
    this.path = path;

    return this;
  }

  static sanitize(unsafePath: string) {
    return path.normalize(unsafePath).replace(/(\.\.(\/)+)+/g, '');
  }

  load(callback?: (content: string, err?: NodeJS.ErrnoException) => void): void {
    fs.readFile(this.path, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        this.error = err;
        logger.error(`File open: ${this.path}, error: ${err}`, err);
      } else {
        this.contents = data;
        logger.log(`File open: ${this.path}`);
      }

      if (callback)
        callback.call(
          this,
          data,
          err 
            ? new Error(`Failed to open ${path.basename(this.path)}`)
            : undefined
        );
    });
  }

  save(data: string, callback?: (error?: NodeJS.ErrnoException) => void): void {
    fs.writeFile(this.path, data, { encoding: 'utf8' }, (err) => {
      if (err) {
        this.error = err;
        logger.error(`File write: ${this.path}, error: ${err}`, err);
      } else {
        this.contents = data;
        logger.log(`File write: ${this.path}`);
      }

      if (callback) 
        callback.call(
          this,
          err 
            ? new Error(`Failed to save ${path.basename(this.path)}`)
            : undefined
        );
    });
  }

  delete(callback?: (error?: NodeJS.ErrnoException) => void): void {
    fs.unlink(this.path, (err) => {
      if (err) {
        this.error = err;
        logger.error(`File remove: ${this.path}, error: ${err}`, err);
      }

      this.contents = '';
      logger.log(`File remove: ${this.path}`);

      if (callback) 
        callback.call(
          this,
          err 
            ? new Error(`Failed to delete ${path.basename(this.path)}`)
            : undefined
        );
    });
  }

}
