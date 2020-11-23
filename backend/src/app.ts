import express from 'express';

import router from './routes/router';

const App = express();

const PROXY_IP = process.env.IS_BEHIND_PROXY;
if (PROXY_IP) {
  App.set('trust proxy', PROXY_IP);
}

App.use(express.json());

App.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.removeHeader('X-Powered-By');
  next();
});

App.use(router);

export default App;
