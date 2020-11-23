import { HaproxyParsers } from '../const';
import Acl from './parsers/acl';
import Daemon from './parsers/daemon';
import Errofile from './parsers/errorfile';
import HttpRequest from './parsers/http-request';
import HttpResponse from './parsers/http-response';
import MultipleArgumentsParser from './parsers/multiple-arguments';
import SingleArgument from './parsers/single-arguments';
import Timeout from './parsers/timeout';

export const parsers = {
  [HaproxyParsers.timeout]: Timeout,
  [HaproxyParsers.errorfile]: Errofile,
  [HaproxyParsers.description]: SingleArgument,
  [HaproxyParsers.acl]: Acl,
  [HaproxyParsers.daemon]: Daemon,
  [HaproxyParsers.mode]: SingleArgument,
  [HaproxyParsers['http-request']]: HttpRequest,
  [HaproxyParsers['http-response']]: HttpResponse
};

export const mapParser = (type: string) => {
  return parsers[type] || MultipleArgumentsParser;
};

export default mapParser;
