import express from 'express';

import { getConfigFile } from '../components/file-operations';
import { HaproxyCustomSectionsList } from '../const';
import ConfigParser from '../haproxy/cfg-parser';
import { HaproxyCustomSectionsEnum } from '../typings';
import FileHandler from '../util/file';
import logger from '../util/log';

const SectionsRouter = express.Router();

/** Config endpoints structure
 * {
 *    file: string,
 *    data: HaproxyConfig
 * }
 */

/**
 * Get parsed section
 */
SectionsRouter.get(`/:config_file/:section(${HaproxyCustomSectionsList.join('|')})`, (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;

  getConfigFile(fileName)
    .then((content: string) => {
      logger.log(`GET /cfg/${fileName}/${sectionName}`);
      const conf = new ConfigParser(content);

      res.json({
        file: fileName,
        data: conf.getSection(sectionName)
      });
    })
    .catch((err) => {
      logger.error(`GET /cfg/${fileName}/${sectionName}`, err);
      res.status(400).end();
    });
});

/**
 * Get raw section
 */
SectionsRouter.get(`/raw/:config_file/:section(${HaproxyCustomSectionsList.join('|')})`, (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;

  getConfigFile(fileName)
    .then((content: string) => {
      logger.log(`GET /cfg/raw/${fileName}/${sectionName}`);
      const conf = new ConfigParser(content);

      const cleanedContent = conf.getRawSection(sectionName);

      res.type('text/plain');
      res.status(200).send(cleanedContent);
    })
    .catch((err) => {
      logger.error(`GET /cfg/raw/${fileName}/${sectionName}`, err);
      res.status(400).end();
    });
});

/**
 * Get parsed specific section from: frontends, backends, listeners
 */
SectionsRouter.get(`/:config_file/:section(${HaproxyCustomSectionsList.join('|')})/:name`, (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;

  getConfigFile(fileName)
    .then((content: string) => {
      logger.log(`GET /cfg/${fileName}/${sectionName}/${uniqueSectionName}`);
      const conf = new ConfigParser(content);

      res.json({
        file: fileName,
        data: {
          [sectionName]: {
            [uniqueSectionName]: conf.getNamedSection(sectionName, uniqueSectionName)[uniqueSectionName]
          }
        }
      });
    })
    .catch((err) => {
      logger.error(`GET /cfg/${fileName}/${sectionName}/${uniqueSectionName}`, err);
      res.status(400).end();
    });
});

SectionsRouter.get(`/raw/:config_file/:section(${HaproxyCustomSectionsList.join('|')})/:name`, (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;

  getConfigFile(fileName)
    .then((content: string) => {
      logger.log(`GET /cfg/raw/${fileName}/${sectionName}`);
      const conf = new ConfigParser(content);

      const cleanedContent = conf.getRawNamedSection(sectionName, uniqueSectionName);

      res.type('text/plain');
      res.status(200).send(cleanedContent);
    })
    .catch((err) => {
      logger.error(`GET /cfg/raw/${fileName}/${sectionName}/raw`, err);
      res.status(400).end();
    });
});

export default SectionsRouter;