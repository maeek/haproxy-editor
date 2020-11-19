import express from 'express';
import { getConfigFile, rmConfigFile, setConfigFile } from '../components/config';
import ConfigParser from '../haproxy/cfg-parser';
import FileHandler from '../util/file';
import logger from '../util/log';

const ConfigRouter = express.Router();

ConfigRouter.get('/:file', (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitize(req.params.file);

  getConfigFile(fileName)
    .then((content: string) => {
      logger.log(`GET Config route accessed with file: ${fileName}`);
      const conf = new ConfigParser(content);
      conf.parse();
      res.json(conf.parsedConfig);
    })
    .catch(() => {
      logger.error(`GET Config route failed to access with file: ${fileName}`);
      res.status(400).end();
    });
});

ConfigRouter.get('/:file/raw', (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitize(req.params.file);

  getConfigFile(fileName)
    .then((content: string) => {
      logger.log(`GET Config route accessed with file: ${fileName}`);
      res.type('text/plain');
      res.send(content);
    })
    .catch(() => {
      logger.error(`GET Config route failed to access with file: ${fileName}`);
      res.status(400).end();
    });
});

ConfigRouter.put('/:file', (req: express.Request, res: express.Response) => {
  const fileName = req.params.file;
  
  const body = req.body;
  const conf = new ConfigParser(body);

  setConfigFile(fileName, conf.content)
    .then(() => {
      logger.log(`PUT Config route accessed with file: ${fileName}`);
      res.json(conf.parsedConfig);
    })
    .catch(() => {
      logger.log(`PUT Config route failed to write into file: ${fileName}`);
      res.status(400).end();
    });
});

ConfigRouter.delete('/:file', (req: express.Request, res: express.Response) => {
  const fileName = req.params.file;

  logger.log(`DELETE Config route accessed with file: ${fileName}`);

  rmConfigFile(fileName)
    .then(() => {
      logger.log(`DELETE Config route accessed and removed file: ${fileName}`);
      res.status(200).end();
    })
    .catch(() => {
      logger.log(`DELETE Config route failed to remove file: ${fileName}`);
      res.status(400).end();
    });
});

export default ConfigRouter;