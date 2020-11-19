import fs from 'fs';
import logger from './log';

export default class FileHandler {
  path: string;
  contents: string | Array<string> = '';
  error: NodeJS.ErrnoException | null = null;

  constructor(path: string) {
    this.path = path;

    return this;
  }

  static sanitize(name: string) {
    return name.replace(/(\.\.\/)+/g, '');
  }

  load(callback?: (content: string) => void): void {
    fs.readFile(this.path, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        this.error = err;
        logger.error(`Failed to open a file, path: ${this.path}, error: ${err}`);
        if (callback) callback.call(this, '');
        return  
      }

      this.contents = data;
      logger.log(`Opened file, path: ${this.path}`);

      if (callback) callback.call(this, data);
    });
  }

  save(data: string, callback?: (success: boolean) => void): void {
    fs.writeFile(this.path, data, { encoding: 'utf8' }, (err) => {
      if (err) {
        this.error = err;
        logger.error(`Failed to write to a file, path: ${this.path}, error: ${err}`);
      }

      this.contents = data;
      logger.log(`Written to file, path: ${this.path}`);

      if (callback) callback.call(this, Boolean(!err));
    });
  }

  delete(callback?: (success: boolean) => void): void {
    fs.unlink(this.path, (err) => {
      if (err) {
        this.error = err;
        logger.error(`Failed to delete a file, path: ${this.path}, error: ${err}`);
      }

      this.contents = '';
      logger.log(`Deleted a file, path: ${this.path}`);

      if (callback) callback.call(this, Boolean(!err));
    });
  }

}
