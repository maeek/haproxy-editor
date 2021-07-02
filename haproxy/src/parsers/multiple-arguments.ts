import { Entry, StandardEntry } from '../../typings';
import Generic from './generic';

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

export class MultipleArguments extends Generic {
  static parse(arr: string[]): Entry {
    const [option, ...values] = arr;

    return {
      [option]: values
    };
  }

  static stringify(key: string, entry?: StandardEntry): string {
    return `${MultipleArguments.indent()}${key} ${Array.isArray(entry) ? entry.join(' ') : entry}`;
  }
}

export default MultipleArguments;
