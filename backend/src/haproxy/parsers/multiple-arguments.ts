import { Entry, StandardEntry } from '../../typings';
import Base from './base';

/**
 * Input:
 *   bind *:443 ssl crt /certs/pem/
 * 
 * Output:
 * 
 *   {
 *     "bind": [
 *        "*:443",
 *        "ssl",
 *        "crt",
 *        "/certs/pem/"
 *      ]
 *   }
 *
 */

export class MultipleArguments extends Base {
  static parse(arr: Array<string>): Entry {
    const [option, ...values] = arr;

    return {
      [option]: values
    };
  }

  static stringify(key: string, entry?: StandardEntry): string {
    return `${MultipleArguments.indent()}${key} ${Array.isArray(entry) ? entry.join(' ') : entry}`;
  }
};

export default MultipleArguments;
