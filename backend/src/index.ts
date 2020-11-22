import './load-vars';
// import path from 'path';
// import FileHandler from './util/file';
import logger from './util/log'
import App from './app';
// import ConfigParser from './haproxy/cfg-parser';

const PORT = process.env.API_PORT || 8080;

App.listen(PORT, () => {
  logger.log(`Server listening on http://localhost:${PORT}/`);
});

/**
 * Testing purposes
 */
// const file = new FileHandler(path.join(__dirname, '../../test_config'))
// file.load((content) => {
//   const conf = new ConfigParser(content);
//   conf.parse()
//   conf.stringify()
//   // conf.toString()
// });
