import express from 'express';
import CfgRouter from './cfg';

const Router = express.Router();

Router.use('/cfg/', CfgRouter);
// Router.use('/map/', );
// Router.use('/service/', );

export default Router;