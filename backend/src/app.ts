import express from 'express';

import router from './routes/router';

const App = express();

const PROXY_IP = process.env.PROXY_IP;
if (PROXY_IP) {
  App.set('trust proxy', PROXY_IP);
}

App.use(express.json());

App.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.removeHeader('X-Powered-By');
  next();
});

App.use(router);

export default App;
