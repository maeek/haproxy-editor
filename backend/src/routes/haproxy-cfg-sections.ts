import express from 'express';

import { getConfigFile } from '../components/file-operations';
import { HaproxyCustomSectionsList } from '../const';
import ConfigParser from '../haproxy/cfg-parser';
import { HaproxyCustomSectionsEnum } from '../typings';
import FileHandler from '../util/file';
import logger from '../util/log';
import { prepareErrorMessageJson } from '../util/error';

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
    .then((file: FileHandler) => {
      logger.log(`GET /cfg/${fileName}/${sectionName}`);

      const content = file.contents;
      const conf = new ConfigParser(content);

      res.json({
        file: fileName,
        data: conf.getSection(sectionName)
      });
    })
    .catch((err: string) => {
      logger.error(`GET /cfg/${fileName}/${sectionName}`, new Error(err));
      res.status(400).json(prepareErrorMessageJson(err));
    });
});

/**
 * Create new/overwrite existing section in config
 * body:
 * {
 *   [section: HaproxyCustomSectionsEnum]: {
 *     [key: string]: HaproxyBackend | HaproxyFrontend | HaproxyListen | HaproxyGlobal | HaproxyDefaults
 *   }
 * }
 */
SectionsRouter.post(`/:config_file/:section(${HaproxyCustomSectionsList.join('|')})`, (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const body = req.body[sectionName] || {};

  getConfigFile(fileName)
    .then((file: FileHandler) => {
      logger.log(`POST /cfg/${fileName}/${sectionName}`);

      const content = file.contents;
      const conf = new ConfigParser(content);

      conf.parsedConfig[sectionName] = body;
      conf.toString();

      file.save(conf.content)
        .then(() => {
          res.json({
            file: fileName,
            data: conf.getSection(sectionName)
          });
        })
        .catch((e: string) => {
          logger.error(`POST /cfg/${fileName}/${sectionName}`, new Error(e));
          res.status(400).json(prepareErrorMessageJson(e));
        });
    })
    .catch((err: string) => {
      logger.error(`POST /cfg/${fileName}/${sectionName}`, new Error(err));
      res.status(400).json(prepareErrorMessageJson(err));
    });
});

/**
 * Adds new entries to section in config
 * body:
 * {
 *   [section: HaproxyCustomSectionsEnum]: {
 *     [key: string]: HaproxyBackend | HaproxyFrontend | HaproxyListen | HaproxyGlobal | HaproxyDefaults
 *   }
 * }
 */
SectionsRouter.put(`/:config_file/:section(${HaproxyCustomSectionsList.join('|')})`, (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const body = req.body[sectionName];

  getConfigFile(fileName)
    .then((file: FileHandler) => {
      if (!body) {
        const e = new Error(`Unsupported section name: [${Object.keys(req.body).join(', ')}], check Haproxy documentation`);
        logger.error(`PUT /cfg/${fileName}/${sectionName}`, e);
        res.status(400).json(prepareErrorMessageJson(e));
      }
      
      logger.log(`PUT /cfg/${fileName}/${sectionName}`);
      
      const content = file.contents;
      const conf = new ConfigParser(content);

      conf.parsedConfig[sectionName] = {
        ...conf.parsedConfig[sectionName],
        ...body
      };
      conf.toString();

      file.save(conf.content)
        .then(() => {
          res.json({
            file: fileName,
            data: conf.getSection(sectionName)
          });
        })
        .catch((e: string) => {
          logger.error(`PUT /cfg/${fileName}/${sectionName}`, new Error(e));
          res.status(400).json(prepareErrorMessageJson(e));
        });
    })
    .catch((err: string) => {
      logger.error(`PUT /cfg/${fileName}/${sectionName}`, new Error(err));
      res.status(400).json(prepareErrorMessageJson(err));
    });
});

/**
 * Get raw section
 */
SectionsRouter.get(`/raw/:config_file/:section(${HaproxyCustomSectionsList.join('|')})`, (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;

  getConfigFile(fileName)
    .then((file: FileHandler) => {
      logger.log(`GET /cfg/raw/${fileName}/${sectionName}`);

      const content = file.contents;
      const conf = new ConfigParser(content);

      const cleanedContent = conf.getRawSection(sectionName);

      res.type('text/plain');
      res.status(200).send(cleanedContent);
    })
    .catch((err: string) => {
      logger.error(`GET /cfg/raw/${fileName}/${sectionName}`, new Error(err));
      res.status(400).json(prepareErrorMessageJson(err));
    });
});

/**
 * Get parsed specific section from: HaproxyCustomSectionsEnum
 */
SectionsRouter.get(`/:config_file/:section(${HaproxyCustomSectionsList.join('|')})/:name`, (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;

  getConfigFile(fileName)
    .then((file: FileHandler) => {
      logger.log(`GET /cfg/${fileName}/${sectionName}/${uniqueSectionName}`);

      const content = file.contents;
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
    .catch((err: string) => {
      logger.error(`GET /cfg/${fileName}/${sectionName}/${uniqueSectionName}`, new Error(err));
      res.status(400).json(prepareErrorMessageJson(err));
    });
});

SectionsRouter.get(`/raw/:config_file/:section(${HaproxyCustomSectionsList.join('|')})/:name`, (req: express.Request, res: express.Response) => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;

  getConfigFile(fileName)
    .then((file: FileHandler) => {
      logger.log(`GET /cfg/raw/${fileName}/${sectionName}`);

      const content = file.contents;
      const conf = new ConfigParser(content);

      const cleanedContent = conf.getRawNamedSection(sectionName, uniqueSectionName);

      res.type('text/plain');
      res.status(200).send(cleanedContent);
    })
    .catch((err: string) => {
      logger.error(`GET /cfg/raw/${fileName}/${sectionName}/raw`, new Error(err));
      res.status(400).json(prepareErrorMessageJson(err));
    });
});

export default SectionsRouter;