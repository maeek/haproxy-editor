import express from 'express';
import YAML from 'json-to-pretty-yaml';

import { getConfig, setConfig, updateConfig } from '../components/config-operations';
import { HaproxyCustomNonUniqueSectionsList, HaproxyCustomSectionsList, HaproxyCustomToSectionName } from '../const';
import ConfigParser from '../haproxy/cfg-parser';
import { HaproxyConfig, HaproxyCustomSectionsEnum } from '../typings';
import { prepareErrorMessageJson } from '../util/error';
import FileHandler from '../util/file';
import logger from '../util/log';
import OptionsRouter from './haproxy-cfg-options';

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
  const fileName = req.params.config_file;
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const format = req.query.format;

  getConfig(fileName)
    .then((conf: ConfigParser) => {
      logger.log(`GET /cfg/${fileName}/${sectionName}`);

      const location = ConfigParser.findSectionIndexes(conf.content.split('\n'))[sectionName];
      const section = conf.getSection(sectionName);

      if (Object.keys((section as any)[sectionName]).length === 0) {
        res.status(404).json(prepareErrorMessageJson('Section is empty', 404));
        return;
      }

      if (format === 'raw') {
        res.type('text/plain');
        res.status(200).send(conf.getRawSection(sectionName));
      } else if (format === 'yaml') {
        res.type('text/yaml');
        res.status(200).send(YAML.stringify(section));
      } else {
        res.json({
          file: fileName,
          location,
          data: {
            [sectionName]: section[sectionName]
          }
        });
      }
    })
    .catch((err: string) => {
      logger.error(`GET /cfg/${fileName}/${sectionName}`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
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
  const fileName = req.params.config_file;
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const body = req.body[sectionName];

  if (!body) {
    const e = new Error(`You're trying to update wrong section. Unsupported section name: ${Object.keys(req.body).join(', ')}, check Haproxy documentation for supported sections`);
    logger.error(`POST /cfg/${fileName}/${sectionName}`, e);
    res.status(400).json(prepareErrorMessageJson(e));
    return;
  }

  setConfig(fileName, sectionName, body)
    .then((conf: HaproxyConfig) => {
      logger.log(`POST /cfg/${fileName}/${sectionName}`);

      res.json({
        file: fileName,
        data: conf
      });
    })
    .catch((err: string) => {
      logger.error(`POST /cfg/${fileName}/${sectionName}`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
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

  if (!body) {
    const e = new Error(`Unsupported section name: [${Object.keys(req.body).join(', ')}], check Haproxy documentation`);
    logger.error(`PUT /cfg/${fileName}/${sectionName}`, e);
    res.status(400).json(prepareErrorMessageJson(e));
    return;
  }

  updateConfig(fileName, sectionName, body)
    .then((conf: HaproxyConfig) => {
      logger.log(`PUT /cfg/${fileName}/${sectionName}`);

      res.json({
        file: fileName,
        data: conf
      });
    })
    .catch((err: string) => {
      logger.error(`PUT /cfg/${fileName}/${sectionName}`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
    });
});

/**
 * Get parsed specific section from: HaproxyCustomNonUniqueSectionsList
 */
SectionsRouter.get(`/:config_file/:section(${HaproxyCustomNonUniqueSectionsList.join('|')})/:name`, (req: express.Request, res: express.Response) => {
  const fileName = req.params.config_file;
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;
  const format = req.query.format;

  getConfig(fileName)
    .then((conf: ConfigParser) => {
      logger.log(`GET /cfg/${fileName}/${sectionName}/${uniqueSectionName}  (Get unique section)`);

      const key = `${HaproxyCustomToSectionName[sectionName]} ${uniqueSectionName}`;
      const sectionLocation = ConfigParser.findSectionIndexes(conf.content.split('\n'))[key]; // TODO: Useful but to be rafactored
      const section = conf.getNamedSection(sectionName, uniqueSectionName)[uniqueSectionName];

      if (Object.keys(section as any).length === 0) {
        res.status(404).json(prepareErrorMessageJson('Section not found', 404));
        return;
      }

      if (format === 'raw') {
        res.type('text/plain');
        res.status(200).send(conf.getRawNamedSection(sectionName, uniqueSectionName));
      } else if (format === 'yaml') {
        res.type('text/yaml');
        res.status(200).send(YAML.stringify(section));
      } else {
        res.json({
          file: fileName,
          location: sectionLocation,
          data: {
            [sectionName]: {
              [uniqueSectionName]: section
            }
          }
        });
      }
    })
    .catch((err: string) => {
      logger.error(`GET /cfg/${fileName}/${sectionName}/${uniqueSectionName}`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
    });
});

SectionsRouter.use('/', OptionsRouter);

export default SectionsRouter;
