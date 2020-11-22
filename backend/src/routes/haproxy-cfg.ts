import express from 'express';
import { prepareErrorMessageJson } from '../util/error';
import { getConfigFile, rmConfigFile, setConfigFile } from '../components/haproxy-cfg';
import ConfigParser from '../haproxy/cfg-parser';
import FileHandler from '../util/file';
import logger from '../util/log';
import SectionRouter from './sections';

const HaproxyCfgRouter = express.Router();

/** Config endpoints structure
 * {
 *    file: string,
 *    config: HaproxyConfig
 * }
 */

/**
 * Get parsed config
 */
HaproxyCfgRouter.get('/:config_file', (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitize(req.params.config_file);

  getConfigFile(fileName)
    .then((content: string) => {
      logger.log(`GET /cfg/${fileName}`);

      const conf = new ConfigParser(content);
      conf.parse();

      res.status(200).json({
        file: fileName,
        config: conf.parsedConfig
      });
    })
    .catch((e: string) => {
      logger.error(`GET /cfg/${fileName}`, new Error(e));

      res.status(400).json(prepareErrorMessageJson(e));
    });
});

/**
 * Get source config file
 */
HaproxyCfgRouter.get('/:config_file/raw', (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitize(req.params.config_file);

  getConfigFile(fileName)
    .then((content: string) => {
      logger.log(`GET /cfg/${fileName}/raw`);

      res.type('text/plain');
      res.status(200).send(content);
    })
    .catch((e: string) => {
      logger.error(`GET /cfg/${fileName}/raw`, new Error(e));

      res.status(400).json(prepareErrorMessageJson(e));
    });
});

/**
 * Create new/overwrite existing config file
 */
HaproxyCfgRouter.post('/:config_file', (req: express.Request, res: express.Response) => {
  const fileName = req.params.config_file;
  const body = req.body;
  const conf = new ConfigParser(body);

  setConfigFile(fileName, conf.content)
    .then(() => {
      logger.log(`POST /cfg/${fileName}`);

      res.status(200).json({ file: fileName });
    })
    .catch((e: string) => {
      logger.error(`POST /cfg/${fileName}`, new Error(e));

      res.status(400).json(prepareErrorMessageJson(e));
    });
});

/**
 * Remove config file from filesystem
 */
HaproxyCfgRouter.delete('/:config_file', (req: express.Request, res: express.Response) => {
  const fileName = req.params.config_file;

  rmConfigFile(fileName)
  .then(() => {
      logger.log(`DELETE /cfg/${fileName}`);
      res.status(200).end();
    })
    .catch((e: string) => {
      logger.error(`DELETE /cfg/${fileName}`, new Error(e));
      res.status(400).json(prepareErrorMessageJson(e));
    });
});

HaproxyCfgRouter.use('/', SectionRouter);

export default HaproxyCfgRouter;