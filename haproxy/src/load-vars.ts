import dotenv from 'dotenv';
import path from 'path';

if (!process.env.APP_DIR) {
  process.env.APP_DIR = path.join(__dirname, '../');
}

if (process.env.MODE === 'development') {
  dotenv.config({path: path.join(__dirname, '../.env.development') });

  console.table({
    appDir: process.env.APP_DIR,
    configDir: process.env.CONFIG_DIR
  });
} else if (process.env.MODE === 'test') {
  dotenv.config({path: path.join(__dirname, '../.env.test') });
} else {
  dotenv.config({path: path.join(__dirname, '../.env') });
  process.env.APP_DIR = __dirname;
}
