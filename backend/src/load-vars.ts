import dotenv from 'dotenv';
import path from 'path';

if (process.env.MODE === 'development') {
  dotenv.config({path: path.resolve(__dirname, '../.env.development') });
} else if (process.env.MODE === 'test') {
  dotenv.config({path: path.resolve(__dirname, '../.env.test') });
} else {
  dotenv.config({path: path.resolve(__dirname, '../.env') });
}
