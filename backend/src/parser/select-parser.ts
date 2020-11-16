import errorfileParser from './parsers/errorfile';
import timeoutParser from './parsers/timeout';
import basicParser from './parsers/basic';

import { HaproxyCustomParsers } from '../const';

export const parsers = {
  [HaproxyCustomParsers.timeout]: timeoutParser,
  [HaproxyCustomParsers.errorfile]: errorfileParser
};

export const selectParser = (type: string) => {
    return parsers[type] || basicParser;
  }


export default selectParser;
