import express from 'express';
import ConfigParser from 'haproxy/build/cfg-parser';
import YAML from 'json-to-pretty-yaml';

import { getConfig } from '../components/config-manipulations';
import {
  getConfigFiles as getFiles, rmConfigFile, setConfigFile
} from '../components/file-manipulations';
import { prepareErrorMessageJson } from '../util/error';
import logger from '../util/log';

export const getConfigFiles = (_req: express.Request, res: express.Response): void => {
  getFiles()
    .then((files: string[]) => {
      res.status(200).json({
        data: {
          files,
          total: files.length
        }
      });
    })
    .catch((error: string) => {
      logger.error('GET /cfg/', new Error(error));

      res.status(500).json(prepareErrorMessageJson(error, 500));
    });
};

export const getParsedConfig = (req: express.Request, res: express.Response): void => {
  const fileName = req.params.config_file;
  const format = req.query.format;

  getConfig(fileName)
    .then((conf: ConfigParser) => {
      if (format === 'raw') {
        res.type('text/plain');
        res.status(200).send(conf.toString());
      } else if (format === 'yaml') {
        res.type('text/yaml');
        res.status(200).send(YAML.stringify(conf.parsedConfig));
      } else {
        res.status(200).json({
          file: fileName,
          data: conf.parsedConfig
        });
      }
    })
    .catch((e: string) => {
      logger.error(`GET /cfg/${fileName}`, new Error(e));

      res.status(500).json(prepareErrorMessageJson(e, 500));
    });
};

export const createNewConfigFile = (req: express.Request, res: express.Response): void => {
  const fileName = req.params.config_file;
  const body = req.body;
  const conf = new ConfigParser(body);

  setConfigFile(fileName, conf.content)
    .then(() => {
      res.status(201).json({ file: fileName });
    })
    .catch((e: string) => {
      logger.error(`POST /cfg/${fileName}`, new Error(e));

      res.status(500).json(prepareErrorMessageJson(e, 500));
    });
};

export const deleteConfigFile = (req: express.Request, res: express.Response): void => {
  const fileName = req.params.config_file;

  rmConfigFile(fileName)
    .then(() => {
      res.status(204).end();
    })
    .catch((e: string) => {
      logger.error(`DELETE /cfg/${fileName}`, new Error(e));
      res.status(500).json(prepareErrorMessageJson(e, 500));
    });
};
