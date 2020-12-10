import express from 'express';

import {
  addToNonUniqueSection, addToSection, createNewNonUniqueSection, createNewSection,
  deleteNonUniqueSection, deleteSection, getNonUniqueSection, getSection
} from '../controllers/cfg-sections-controller';
import OptionsRouter from './haproxy-cfg-options';
import routes from './routes-map';

const SectionsRouter = express.Router({mergeParams: true});

/** Config endpoints structure
 * {
 *    file: string,
 *    data: HaproxyConfig
 * }
 */

/**
 * Get parsed section
 */
SectionsRouter.get(routes.cfg.section, getSection);

/**
 * Create new/overwrite existing section in config
 * body:
 * {
 *   [section: HaproxyCustomSectionsEnum]: {
 *     [key: string]: HaproxyBackend | HaproxyFrontend | HaproxyListen | HaproxyGlobal | HaproxyDefaults
 *   }
 * }
 */
SectionsRouter.post(routes.cfg.section, createNewSection);

/**
 * Adds new entries to section in config
 * body:
 * {
 *   [section: HaproxyCustomSectionsEnum]: {
 *     [key: string]: HaproxyBackend | HaproxyFrontend | HaproxyListen | HaproxyGlobal | HaproxyDefaults
 *   }
 * }
 */
SectionsRouter.put(routes.cfg.section, addToSection);

SectionsRouter.delete(routes.cfg.section, deleteSection);

/**
 * Get parsed specific section from: HaproxyCustomNonUniqueSectionsList
 */
SectionsRouter.get(routes.cfg.named_section, getNonUniqueSection);

SectionsRouter.post(routes.cfg.named_section, createNewNonUniqueSection);

SectionsRouter.put(routes.cfg.named_section, addToNonUniqueSection);

SectionsRouter.delete(routes.cfg.named_section, deleteNonUniqueSection);

SectionsRouter.use('/', OptionsRouter);

export default SectionsRouter;
