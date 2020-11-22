import express from 'express';
import { getConfigFile, rmConfigFile, setConfigFile } from '../components/cfg';
import ConfigParser from '../haproxy/cfg-parser';
import FileHandler from '../util/file';
import logger from '../util/log';

const CfgRouter = express.Router();

CfgRouter.get('/:config_file', (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitize(req.params.config_file);

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

CfgRouter.get('/:config_file/raw', (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitize(req.params.config_file);

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

CfgRouter.put('/:config_file', (req: express.Request, res: express.Response) => {
  const fileName = req.params.config_file;
  
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

CfgRouter.delete('/:config_file', (req: express.Request, res: express.Response) => {
  const fileName = req.params.config_file;

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

export default CfgRouter;