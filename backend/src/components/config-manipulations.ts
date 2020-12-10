/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigParser from 'haproxy/build/cfg-parser';
import {
  HaproxyAnySection, HaproxyConfig, HaproxyCustomSectionsEnum, HaproxyUniqueSections
} from 'haproxy/typings';

import FileHandler from '../util/file';
import * as FileOperations from './file-manipulations';

export const getConfig = (requestedFileName: string): Promise<ConfigParser> => 
  new Promise<ConfigParser>((resolve, reject) => {
    FileOperations.getConfigFile(requestedFileName)
      .then((file: FileHandler) => {
        const content = file.contents;
        const conf = new ConfigParser(content);

        resolve(conf);
      })
      .catch((e) => {
        reject(e);
      });
  });

export const setConfig = (fileName: string, sectionName: HaproxyCustomSectionsEnum, data: HaproxyAnySection): Promise<HaproxyConfig> =>
  new Promise<HaproxyConfig>((resolve, reject) => {
    getConfig(fileName)
      .then((conf: ConfigParser) => {

        conf.parsedConfig[sectionName] = data;
        conf.toString();

        FileOperations.setConfigFile(fileName, conf.content)
          .then(() => {
            resolve(conf.getSection(sectionName));
          })
          .catch((e: string) => {
            reject(e);
          });
      })
      .catch((err: string) => {
        reject(err);
      });
  });

export const updateConfig = (fileName: string, sectionName: HaproxyCustomSectionsEnum, data: HaproxyAnySection): Promise<HaproxyConfig> =>
  new Promise<HaproxyConfig>((resolve, reject) => {
    getConfig(fileName)
      .then((conf: ConfigParser) => {

        conf.parsedConfig[sectionName] = {
          ...conf.parsedConfig[sectionName],
          ...(data as any)
        };

        conf.toString();

        FileOperations.setConfigFile(fileName, conf.content)
          .then(() => {
            resolve(conf.getSection(sectionName));
          })
          .catch((e: string) => {
            reject(e);
          });
      })
      .catch((err: string) => {
        reject(err);
      });
  });

export const setNonUniqueConfig = (fileName: string, sectionName: HaproxyCustomSectionsEnum, nonUniqieName: string, data: HaproxyAnySection): Promise<HaproxyConfig> =>
  new Promise<HaproxyConfig>((resolve, reject) => {
    getConfig(fileName)
      .then((conf: ConfigParser) => {
        if (!conf.parsedConfig[sectionName]) {
          conf.parsedConfig[sectionName] = {} as HaproxyAnySection;
        }

        (conf.parsedConfig[sectionName] as HaproxyUniqueSections)[nonUniqieName] = data as any;
    
        conf.toString();

        FileOperations.setConfigFile(fileName, conf.content)
          .then(() => {
            resolve(conf.getSection(sectionName));
          })
          .catch((e: string) => {
            reject(e);
          });
      })
      .catch((err: string) => {
        reject(err);
      });
  });

export const updateNonUniqueConfig = (fileName: string, sectionName: HaproxyCustomSectionsEnum, nonUniqieName: string, data: HaproxyAnySection): Promise<HaproxyConfig> =>
  new Promise<HaproxyConfig>((resolve, reject) => {
    getConfig(fileName)
      .then((conf: ConfigParser) => {

        conf.parsedConfig[sectionName] = {
          ...(conf.parsedConfig[sectionName] as HaproxyUniqueSections),
          [nonUniqieName]: {
            ...(conf.parsedConfig[sectionName] as HaproxyUniqueSections)[nonUniqieName],
            ...(data as any)
          }
        } as HaproxyAnySection;

        conf.toString();

        FileOperations.setConfigFile(fileName, conf.content)
          .then(() => {
            resolve(conf.getSection(sectionName));
          })
          .catch((e: string) => {
            reject(e);
          });
      })
      .catch((err: string) => {
        reject(err);
      });
  });

