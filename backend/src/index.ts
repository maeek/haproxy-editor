import './load-vars';
import express from 'express';
// import path from 'path';
// import FileHandler from './util/file';
import logger from './util/log'
// import ConfigParser from './haproxy/cfg-parser';
import router from './routes/router';

const App = express();

const PROXY_IP = process.env.IS_BEHIND_PROXY;
const PORT = process.env.API_PORT || 8080;

App.use(express.json());

if (PROXY_IP) {
  App.set('trust proxy', PROXY_IP);
}

App.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.removeHeader('X-Powered-By');
  next();
});

App.use(router);

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
