import express from 'express';

import { getConfigFile, rmConfigFile, setConfigFile } from '../components/file-operations';
import MapParser from '../haproxy/map-parser';
import { prepareErrorMessageJson } from '../util/error';
import FileHandler from '../util/file';
import logger from '../util/log';

const HaproxyMapRouter = express.Router();

/**
 * Get parsed map file
 */
HaproxyMapRouter.get('/:map_file', (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.map_file);

  getConfigFile(fileName)
    .then((content: string) => {
      logger.log(`GET /map/${fileName}`);

      const conf = new MapParser(content);

      res.status(200).json({
        file: fileName,
        data: conf.parsedContentObj
      });
    })
    .catch((e: string) => {
      logger.error(`GET /map/${fileName}`, new Error(e));

      res.status(400).json(prepareErrorMessageJson(e));
    });
});

/**
 * Get source map file
 */
HaproxyMapRouter.get('/raw/:map_file', (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.map_file);

  getConfigFile(fileName)
    .then((content: string) => {
      logger.log(`GET /cfg/raw/${fileName}`);

      const conf = new MapParser(content);

      res.type('text/plain');
      res.status(200).send(conf.toString());
    })
    .catch((e: string) => {
      logger.error(`GET /cfg/raw/${fileName}/raw`, new Error(e));

      res.status(400).json(prepareErrorMessageJson(e));
    });
});

/**
 * Create new/overwrite existing map file
 */
HaproxyMapRouter.post('/:map_file', (req: express.Request, res: express.Response) => {
  const fileName = req.params.map_file;
  const body = req.body.map;
  const conf = new MapParser(body);

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
 * Remove map file from filesystem
 */
HaproxyMapRouter.delete('/:map_file', (req: express.Request, res: express.Response) => {
  const fileName = req.params.map_file;

  rmConfigFile(fileName)
  .then(() => {
      logger.log(`DELETE /map/${fileName}`);
      res.status(200).end();
    })
    .catch((e: string) => {
      logger.error(`DELETE /map/${fileName}`, new Error(e));
      res.status(400).json(prepareErrorMessageJson(e));
    });
});

export default HaproxyMapRouter;
