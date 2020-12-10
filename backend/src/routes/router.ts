import express from 'express';
import path from 'path';

import { prepareErrorMessageJson } from '../util/error';
import logger from '../util/log';
import HaproxyCfgRouter from './haproxy-cfg';
import HaproxyMapRouter from './haproxy-map';
import routes from './routes-map';

const Router = express.Router();

const operatingMode = process.env.MODE;
const appendAPIforStandaloneMode = operatingMode === 'prod_standalone' ? '/api' : '';

if (operatingMode === 'prod_standalone') {
  const publicPath = path.join(process.env.APP_DIR || __dirname, '/public');
  Router.use('/', express.static(publicPath, { immutable: true, maxAge: 30*24*60*60*1000 }));
}

if (operatingMode === 'development') {
  Router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

Router.use(appendAPIforStandaloneMode + routes.cfg.base, HaproxyCfgRouter);
Router.use(appendAPIforStandaloneMode + routes.map.base, HaproxyMapRouter);
// Router.use(appendAPIforStandaloneMode + '/service/', ServiceRouter);

Router.use('*', (req: express.Request, res: express.Response) => {
  logger.warning(`${req.method} ${req.path} not found`);
  res.status(404).json(prepareErrorMessageJson(`Endpoint not found, ${req.originalUrl}`, 404));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
Router.use((err: express.ErrorRequestHandler, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(`${req.method} ${req.path} ${err}`, new Error());
  res.status(500).json(prepareErrorMessageJson('Internal server error', 500));
});

export default Router;
