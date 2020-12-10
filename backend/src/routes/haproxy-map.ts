import express from 'express';

import { addToMapFile, addToOrUpdateMapFile, createNewMapFile, getMapFile, removeMapFile } from '../controllers/map-controller';
import routes from './routes-map';

const HaproxyMapRouter = express.Router();

/**
 * Get parsed map file
 */
HaproxyMapRouter.get(routes.map.file, getMapFile);

/**
 * Create new/overwrite existing map file
 * body:
 * {
 *   "map": {
 *     "key": "value"
 *   }
 * }
 */
HaproxyMapRouter.post(routes.map.file, createNewMapFile);

/**
 * Add new entries to existing map file
 * body:
 * {
 *   "map": {
 *     "key": "value"
 *   }
 * }
 */
HaproxyMapRouter.put(routes.map.file, addToMapFile);

/**
 * Adds new, updates existing or removes entries in map file
 * 
 * To remove entry in the list pass empty string as a value like this:
 * {
 *   "map": {
 *     "key": ""
 *   }
 * }
 */
HaproxyMapRouter.patch(routes.map.file, addToOrUpdateMapFile);

/**
 * Remove map file from filesystem
 */
HaproxyMapRouter.delete(routes.map.file, removeMapFile);

export default HaproxyMapRouter;
