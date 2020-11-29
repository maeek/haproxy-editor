import express from 'express';
import YAML from 'json-to-pretty-yaml';

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
  const format = req.query.format;

  getConfigFile(fileName)
    .then((file: FileHandler) => {
      logger.log(`GET /map/${fileName}`);

      const content = file.contents;
      const conf = new MapParser(content);
      if (format === 'raw') {
        res.type('text/plain');
        res.status(200).send(conf.toString());
      }
      else if (format === 'yaml') {
        res.type('text/yaml');
        res.status(200).send(YAML.stringify(conf.parsedContentObj));
      } else {
        res.status(200).json({
          file: fileName,
          data: conf.parsedContentObj
        });
      }
    })
    .catch((e: string) => {
      logger.error(`GET /map/${fileName}`, new Error(e));

      res.status(400).json(prepareErrorMessageJson(e));
    });
});

/**
 * Create new/overwrite existing map file
 * body:
 * {
 *   "map": {
 *     "key": "value"
 *   }
 * }
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
 * Add new entries to existing map file
 * body:
 * {
 *   "map": {
 *     "key": "value"
 *   }
 * }
 */
HaproxyMapRouter.put('/:map_file', (req: express.Request, res: express.Response) => {
  const fileName = req.params.map_file;
  const body = req.body.map;

  getConfigFile(fileName)
    .then((file: FileHandler) => {
      const content = file.contents;
      const conf = new MapParser(content);
      const newKeys = Object.keys(body);

      newKeys.forEach((key: string) => {
        if (!conf.parsedContentObj[key]) {
          conf.parsedContentArray.push([key, body[key]])
        }
      });

      conf.toString();

      file.save(conf.content)
        .then(() => {
          logger.log(`PUT /cfg/${fileName}`);
          res.status(200).json({ file: fileName });
        })
        .catch((e: string) => {
          logger.error(`PUT /cfg/${fileName}`, new Error(e));
          res.status(400).json(prepareErrorMessageJson(e));
        });
    })
    .catch((e: string) => {
      logger.error(`PUT /cfg/${fileName}`, new Error(e));
      res.status(400).json(prepareErrorMessageJson(e));
    });
});

/**
 * Adds new, updates existing or removes entries in map file
 * 
 * To remove entry in the list pass empty string as a value like this:
 * {
 *   "map": {
 *     "key": ""
 *   }
 * }
 */
HaproxyMapRouter.patch('/:map_file', (req: express.Request, res: express.Response) => {
  const fileName = req.params.map_file;
  const body = req.body.map;

  getConfigFile(fileName)
    .then((file: FileHandler) => {
      const content = file.contents;
      const conf = new MapParser(content);

      conf.parsedContentObj = {
        ...conf.parsedContentObj,
        ...body
      };

      Object.keys(body).forEach((key: string) => {
        if (!body[key]) delete conf.parsedContentObj[key];
      });

      conf.parseFromObject();
      conf.toString();

      file.save(conf.content)
        .then(() => {
          logger.log(`PATCH /cfg/${fileName}`);
          res.status(200).json({ file: fileName });
        })
        .catch((e: string) => {
          logger.error(`PUT /cfg/${fileName}`, new Error(e));
          res.status(400).json(prepareErrorMessageJson(e));
        });
    })
    .catch((e: string) => {
      logger.error(`PATCH /cfg/${fileName}`, new Error(e));
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
