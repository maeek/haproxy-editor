import express from 'express';
import ConfigParser from 'haproxy/build/cfg-parser';
import { HaproxyCustomToSectionName } from 'haproxy/build/const';
import { HaproxyAnySection, HaproxyConfig, HaproxyCustomSectionsEnum } from 'haproxy/typings';
import YAML from 'json-to-pretty-yaml';

import {
  getConfig, setConfig, setNonUniqueConfig, updateConfig, updateNonUniqueConfig
} from '../components/config-manipulations';
import { setConfigFile } from '../components/file-manipulations';
import { prepareErrorMessageJson } from '../util/error';
import FileHandler from '../util/file';
import logger from '../util/log';

export const getSection = (req: express.Request, res: express.Response): void => {
  const fileName = req.params.config_file;
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const format = req.query.format;

  getConfig(fileName)
    .then((conf: ConfigParser) => {
      const location = ConfigParser.findSectionIndexes(conf.content.split('\n'))[sectionName];
      const section = conf.getSection(sectionName);

      if (Object.keys((section as HaproxyAnySection)[sectionName]).length === 0) {
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
};

export const createNewSection = (req: express.Request, res: express.Response): void => {
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
      res.json({
        file: fileName,
        data: conf
      });
    })
    .catch((err: string) => {
      logger.error(`POST /cfg/${fileName}/${sectionName}`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
    });
};

export const addToSection = (req: express.Request, res: express.Response): void => {
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
      res.json({
        file: fileName,
        data: conf
      });
    })
    .catch((err: string) => {
      logger.error(`PUT /cfg/${fileName}/${sectionName}`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
    });
};

export const deleteSection = (req: express.Request, res: express.Response): void => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;

  getConfig(fileName)
    .then((conf: ConfigParser) => {
      delete conf.parsedConfig[sectionName];

      setConfigFile(fileName, conf.toString())
        .then(() => {
          res.status(200).json({
            file: fileName
          });
        })
        .catch((err: string) => {
          logger.error(`PUT /cfg/${fileName}/${sectionName}`, new Error(err));
          res.status(500).json(prepareErrorMessageJson(err, 500));
        });

    })
    .catch((err: string) => {
      logger.error(`PUT /cfg/${fileName}/${sectionName}`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
    });
};

export const getNonUniqueSection = (req: express.Request, res: express.Response): void => {
  const fileName = req.params.config_file;
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;
  const format = req.query.format;

  getConfig(fileName)
    .then((conf: ConfigParser) => {
      const key = `${HaproxyCustomToSectionName[sectionName]} ${uniqueSectionName}`;
      const sectionLocation = ConfigParser.findSectionIndexes(conf.content.split('\n'))[key]; // TODO: Useful but to be rafactored
      const section = conf.getNamedSection(sectionName, uniqueSectionName)[uniqueSectionName];

      if (Object.keys(section as HaproxyAnySection).length === 0) {
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
};

export const createNewNonUniqueSection = (req: express.Request, res: express.Response): void => {
  const fileName = req.params.config_file;
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;
  const body = req.body[sectionName][uniqueSectionName];

  if (!body) {
    const e = new Error(`Unsupported section name: [${Object.keys(req.body).join(', ')}], check Haproxy documentation`);
    logger.error(`PUT /cfg/${fileName}/${sectionName}`, e);
    res.status(400).json(prepareErrorMessageJson(e));
    return;
  }

  setNonUniqueConfig(fileName, sectionName, uniqueSectionName, body)
    .then((conf: HaproxyConfig) => {
      res.json({
        file: fileName,
        data: conf
      });
    })
    .catch((err: string) => {
      logger.error(`PUT /cfg/${fileName}/${sectionName}/${uniqueSectionName}`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
    });
};

export const addToNonUniqueSection = (req: express.Request, res: express.Response): void => {
  const fileName = req.params.config_file;
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;
  const body = req.body[sectionName][uniqueSectionName];

  if (!body) {
    const e = new Error(`Unsupported section name: [${Object.keys(req.body).join(', ')}], check Haproxy documentation`);
    logger.error(`PUT /cfg/${fileName}/${sectionName}`, e);
    res.status(400).json(prepareErrorMessageJson(e));
    return;
  }

  updateNonUniqueConfig(fileName, sectionName, uniqueSectionName, body)
    .then((conf: HaproxyConfig) => {
      res.json({
        file: fileName,
        data: conf
      });
    })
    .catch((err: string) => {
      logger.error(`PUT /cfg/${fileName}/${sectionName}/${uniqueSectionName}`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
    });
};

export const deleteNonUniqueSection = (req: express.Request, res: express.Response): void => {
  const fileName = FileHandler.sanitizePath(req.params.config_file);
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;

  getConfig(fileName)
    .then((conf: ConfigParser) => {
      if (conf.parsedConfig[sectionName]) {
        delete (conf.parsedConfig[sectionName] as HaproxyAnySection)[uniqueSectionName];
      }

      setConfigFile(fileName, conf.toString())
        .then(() => {
          res.status(200).json({
            file: fileName
          });
        })
        .catch((err: string) => {
          logger.error(`PUT /cfg/${fileName}/${sectionName}`, new Error(err));
          res.status(500).json(prepareErrorMessageJson(err, 500));
        });

    })
    .catch((err: string) => {
      logger.error(`PUT /cfg/${fileName}/${sectionName}`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
    });
};
