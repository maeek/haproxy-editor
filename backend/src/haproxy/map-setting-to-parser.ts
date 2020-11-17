import Errofile from './parsers/errorfile';
import { HaproxyParsers } from '../const';
import Timeout from './parsers/timeout';
import MultipleArgumentsParser from './parsers/multiple-arguments';
import Daemon from './parsers/daemon';
import SingleArgument from './parsers/single-arguments';

export const parsers = {
  [HaproxyParsers.timeout]: Timeout,
  [HaproxyParsers.errorfile]: Errofile,
  [HaproxyParsers.description]: SingleArgument,
  [HaproxyParsers.daemon]: Daemon,
  [HaproxyParsers.mode]: SingleArgument,

};

export const mapParser = (type: string) => {
    return parsers[type] || MultipleArgumentsParser;
  }


export default mapParser;
