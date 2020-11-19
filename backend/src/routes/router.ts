import express from 'express';
import ConfigRouter from './config';

const Router = express.Router();

Router.use('/config/', ConfigRouter);
// Router.use('/map/', );
// Router.use('/service/', );

export default Router;