import express from 'express';
import { findOptionIndex } from 'haproxy/build/util/sections';
import ConfigParser from 'haproxy/build/cfg-parser';
import { HaproxyCustomToSectionName } from 'haproxy/build/const';
import { HaproxyCustomSectionsEnum } from 'haproxy/typings';
import YAML from 'json-to-pretty-yaml';

import { getConfig } from '../components/config-manipulations';
import { prepareErrorMessageJson } from '../util/error';
import logger from '../util/log';

export const getOptionFromSection = (req: express.Request, res: express.Response): void => {
  const fileName = req.params.config_file;
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const optionName = req.params.option;
  const format = req.query.format;

  getConfig(fileName)
    .then((conf: ConfigParser) => {
      if (format === 'raw') {
        res.type('text/plain');
        res.status(200).send(conf.getRawOptionFromSection(sectionName, optionName));
      } else if (format === 'yaml') {
        res.type('text/yaml');
        res.status(200).send(YAML.stringify(conf.getOptionFromSection(sectionName, optionName)));
      } else {
        const location = findOptionIndex(conf.raw.split('\n'), sectionName, optionName);
        res.json({
          file: fileName,
          location,
          data: {
            [sectionName]: conf.getOptionFromSection(sectionName, optionName)
          }
        });
      }
    })
    .catch((err: string) => {
      logger.error(`GET /cfg/${fileName}/${sectionName}/${optionName} (Get option)`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
    });
};

export const getOptionFromNamedSection = (req: express.Request, res: express.Response): void => {
  const fileName = req.params.config_file;
  const sectionName = req.params.section as HaproxyCustomSectionsEnum;
  const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;
  const optionName = req.params.option;
  const format = req.query.format;

  getConfig(fileName)
    .then((conf: ConfigParser) => {
      if (format === 'raw') {
        res.type('text/plain');
        res.status(200).send(conf.getRawOptionFromSection(sectionName, optionName, uniqueSectionName));
      } else if (format === 'yaml') {
        res.type('text/yaml');
        res.status(200).send(YAML.stringify(conf.getOptionFromSection(sectionName, optionName, uniqueSectionName)));
      } else {
        const location = findOptionIndex(conf.raw.split('\n'), `${HaproxyCustomToSectionName[sectionName]} ${uniqueSectionName}`, optionName);
        res.json({
          file: fileName,
          location,
          data: {
            [sectionName]: {
              [uniqueSectionName]: conf.getOptionFromSection(sectionName, optionName, uniqueSectionName)
            }
          }
        });
      }
    })
    .catch((err: string) => {
      logger.error(`GET /cfg/${fileName}/${sectionName}/${optionName} (Get option)`, new Error(err));
      res.status(500).json(prepareErrorMessageJson(err, 500));
    });
};
