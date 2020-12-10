import express from 'express';

import {
  getOptionFromNamedSection, getOptionFromSection
} from '../controllers/cfg-options-controller';
import routes from './routes-map';

const OptionsRouter = express.Router({mergeParams: true});

/** Config endpoints structure
 * {
 *    file: string,
 *    data: HaproxyConfig,
 *    
 * }
 */

/**
 * Get parsed section
 */
OptionsRouter.get(routes.cfg.option, getOptionFromSection);

/**
 * Get parsed section
 */
OptionsRouter.get(routes.cfg.option_in_named_section, getOptionFromNamedSection);

/**
 * Create new/overwrite existing section in config
 * body:
 * {
 *   [section: HaproxyCustomSectionsEnum]: {
 *     [key: string]: HaproxyBackend | HaproxyFrontend | HaproxyListen | HaproxyGlobal | HaproxyDefaults
 *   }
 * }
 */
// OptionsRouter.post(`/:section(${HaproxyCustomSectionsList.join('|')})`, (req: express.Request, res: express.Response) => {
//   const fileName = FileHandler.sanitizePath(req.params.config_file);
//   const sectionName = req.params.section as HaproxyCustomSectionsEnum;
//   const body = req.body[sectionName] || {};

//   getConfigFile(fileName)
//     .then((file: FileHandler) => {
//       logger.log(`POST /cfg/${fileName}/${sectionName}`);

//       const content = file.contents;
//       const conf = new ConfigParser(content);

//       conf.parsedConfig[sectionName] = body;
//       conf.toString();

//       file.save(conf.content)
//         .then(() => {
//           res.json({
//             file: fileName,
//             data: conf.getSection(sectionName)
//           });
//         })
//         .catch((e: string) => {
//           logger.error(`POST /cfg/${fileName}/${sectionName}`, new Error(e));
//           res.status(400).json(prepareErrorMessageJson(e));
//         });
//     })
//     .catch((err: string) => {
//       logger.error(`POST /cfg/${fileName}/${sectionName}`, new Error(err));
//       res.status(400).json(prepareErrorMessageJson(err));
//     });
// });

// /**
//  * Adds new entries to section in config
//  * body:
//  * {
//  *   [section: HaproxyCustomSectionsEnum]: {
//  *     [key: string]: HaproxyBackend | HaproxyFrontend | HaproxyListen | HaproxyGlobal | HaproxyDefaults
//  *   }
//  * }
//  */
// OptionsRouter.put(`/:section(${HaproxyCustomSectionsList.join('|')})`, (req: express.Request, res: express.Response) => {
//   const fileName = FileHandler.sanitizePath(req.params.config_file);
//   const sectionName = req.params.section as HaproxyCustomSectionsEnum;
//   const body = req.body[sectionName];

//   getConfigFile(fileName)
//     .then((file: FileHandler) => {
//       if (!body) {
//         const e = new Error(`Unsupported section name: [${Object.keys(req.body).join(', ')}], check Haproxy documentation`);
//         logger.error(`PUT /cfg/${fileName}/${sectionName}`, e);
//         res.status(400).json(prepareErrorMessageJson(e));
//       }
      
//       logger.log(`PUT /cfg/${fileName}/${sectionName}`);
      
//       const content = file.contents;
//       const conf = new ConfigParser(content);

//       conf.parsedConfig[sectionName] = {
//         ...conf.parsedConfig[sectionName],
//         ...body
//       };
//       conf.toString();

//       file.save(conf.content)
//         .then(() => {
//           res.json({
//             file: fileName,
//             data: conf.getSection(sectionName)
//           });
//         })
//         .catch((e: string) => {
//           logger.error(`PUT /cfg/${fileName}/${sectionName}`, new Error(e));
//           res.status(400).json(prepareErrorMessageJson(e));
//         });
//     })
//     .catch((err: string) => {
//       logger.error(`PUT /cfg/${fileName}/${sectionName}`, new Error(err));
//       res.status(400).json(prepareErrorMessageJson(err));
//     });
// });

// /**
//  * Get parsed specific section from: HaproxyCustomSectionsEnum
//  */
// OptionsRouter.get(`/:section(${HaproxyCustomSectionsList.join('|')})/:name`, (req: express.Request, res: express.Response) => {
//   const fileName = FileHandler.sanitizePath(req.params.config_file);
//   const sectionName = req.params.section as HaproxyCustomSectionsEnum;
//   const uniqueSectionName = req.params.name as HaproxyCustomSectionsEnum;
//   const format = req.query.format;

//   getConfigFile(fileName)
//     .then((file: FileHandler) => {
//       logger.log(`GET /cfg/${fileName}/${sectionName}/${uniqueSectionName}`);

//       const content = file.contents;
//       const conf = new ConfigParser(content);

//       if (format === 'raw') {
//         res.type('text/plain');
//         res.status(200).send(conf.getRawNamedSection(sectionName, uniqueSectionName));
//       } else if (format === 'yaml') {
//         res.type('text/yaml');
//         res.status(200).send(YAML.stringify(conf.getRawNamedSection(sectionName, uniqueSectionName)));
//       } else {
//         res.json({
//           file: fileName,
//           data: {
//             [sectionName]: {
//               [uniqueSectionName]: conf.getNamedSection(sectionName, uniqueSectionName)[uniqueSectionName]
//             }
//           }
//         });
//       }
//     })
//     .catch((err: string) => {
//       logger.error(`GET /cfg/${fileName}/${sectionName}/${uniqueSectionName}`, new Error(err));
//       res.status(400).json(prepareErrorMessageJson(err));
//     });
// });

export default OptionsRouter;
