import 'dotenv';
import express from 'express';
import path from 'path';
import ConfigParser from './parser/config-parser';
import FileHandler from './util/file';
import logger from './util/log'

const App = express();

App.listen(8080, () => {
  logger.log('Server listening on http://localhost:8080/')
});


/**
 * Testing purposes
 */
const file = new FileHandler(path.join(__dirname, '../../test_config_cleaned'))
file.load((content) => {
  const conf = new ConfigParser(content);
  conf.parse()
});
