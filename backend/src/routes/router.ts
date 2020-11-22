import express from 'express';
import { prepareErrorMessageJson } from '../util/error';
import logger from '../util/log';
import HaproxyCfgRouter from './haproxy-cfg';

const Router = express.Router();

Router.use('/cfg/', HaproxyCfgRouter);
// Router.use('/map/', );
// Router.use('/service/', );

Router.use('*', (req: express.Request, res: express.Response) => {
  logger.warning(`${req.method} ${req.path} not found`);
  res.status(404).json(prepareErrorMessageJson('Endpoint not found', 404));
});

export default Router;