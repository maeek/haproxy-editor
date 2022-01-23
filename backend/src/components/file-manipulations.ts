import fs from 'fs';
import path from 'path';

import FileHandler from '../util/file';

if (!process.env.APP_DIR) {
  process.env.APP_DIR = path.join(__dirname, '../../');
}

const CONFIG_DIR: string = process.env.CONFIG_DIR 
  ? process.env.CONFIG_DIR
  : path.join(process.env.APP_DIR, 'haproxy-configs/');

export const getConfigFiles = (): Promise<string[]> => 
  new Promise((resolve, reject) => {
    fs.readdir(CONFIG_DIR, (err: NodeJS.ErrnoException | null, files: string[]) => {
      if (err) reject('Failed to list files in a folder');

      const results = (files || []).filter((file: string) => {
        return file.endsWith('.cfg') 
          || (!file.endsWith('.map') && !file.endsWith('.lst') && !file.endsWith('.acl'));
      });

      resolve(results);
    });
  });

export const getConfigFile = (requestedFileName: string): Promise<FileHandler> => 
  new Promise<FileHandler>((resolve, reject) => {
    const fileName = FileHandler.sanitizePath(requestedFileName);

    const file = new FileHandler(path.join(CONFIG_DIR, fileName));

    file.load()
      .then(() => resolve(file))
      .catch((error: string) => reject(error));
  });

export const setConfigFile = (requestedFileName: string, data: string): Promise<void> => 
  new Promise<void>((resolve, reject) => {
    const fileName = FileHandler.sanitizePath(requestedFileName);

    const file = new FileHandler(path.join(CONFIG_DIR, fileName));

    file.save(data)
      .then(() => resolve())
      .catch((error: string) => reject(error));
  });

export const rmConfigFile = (requestedFileName: string): Promise<void> => 
  new Promise<void>((resolve, reject) => {
    const fileName = FileHandler.sanitizePath(requestedFileName);

    const file = new FileHandler(path.join(CONFIG_DIR, fileName));

    file.delete()
      .then(() => resolve())
      .catch((error: string) => reject(error));
  });
