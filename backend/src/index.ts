import 'dotenv';
import express from 'express';
import path from 'path';
import FileHandler from './util/file';
import logger from './util/log'
import ConfigParser from './haproxy/cfg-parser';

const App = express();

App.listen(8080, () => {
  logger.log('Server listening on http://localhost:8080/')
});


/**
 * Testing purposes
 */
const file = new FileHandler(path.join(__dirname, '../../test_config'))
file.load((content) => {
  const conf = new ConfigParser(content);
  conf.parse()
  // conf.stringify('ASC')
  // conf.toString()
});
