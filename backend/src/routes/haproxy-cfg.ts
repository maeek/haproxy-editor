import express from 'express';

import {
  createNewConfigFile, deleteConfigFile, getConfigFiles, getParsedConfig
} from '../controllers/cfg-controller';
import SectionRouter from './haproxy-cfg-sections';
import routes from './routes-map';

const HaproxyCfgRouter = express.Router();

// Get configs file list
HaproxyCfgRouter.get('/', getConfigFiles);

/** Config endpoints structure
 * {
 *    file: string,
 *    data: HaproxyConfig
 * }
 *
 * Get parsed config
 */
HaproxyCfgRouter.get(routes.cfg.file, getParsedConfig);

/**
 * Create new/overwrite existing config file
 * body:
 * {
 *   [section: HaproxyCustomSectionsEnum]: {
 *     [key: string]: HaproxyBackend | HaproxyFrontend | HaproxyListen | HaproxyGlobal | HaproxyDefaults
 *   }
 * }
 */
HaproxyCfgRouter.post(routes.cfg.file, createNewConfigFile);

/**
 * Remove config file from filesystem
 */
HaproxyCfgRouter.delete(routes.cfg.file, deleteConfigFile);

HaproxyCfgRouter.use(routes.cfg.file, SectionRouter);

export default HaproxyCfgRouter;
