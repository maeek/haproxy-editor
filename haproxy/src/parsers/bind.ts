import { BindEntry, BindSubEntry, HaproxyAnySection } from '../../typings';
import NonUnique from './non-unique-keys';

/**
 * Input:
 * 
 *  bind *:80
 *  bind *:443 ssl crt /certs/pem/
 * 
 * Output:
 * 
 *  {
 *    "bind": {
 *      "*:80": [],
 *      "*:443": [
 *        'ssl',
 *        'crt',
 *        '/certs/pem/'
 *      ]
 *    }
 *  }
 * 
 */

export class Bind extends NonUnique {
  static parse(arr: Array<string>, parsed?: HaproxyAnySection): BindEntry {
    const parsedBinds: BindSubEntry = parsed?.bind
      ? parsed.bind as BindSubEntry
      : {};

    const [, name, ...options] = arr;

    const results: BindEntry = {
      bind: {
        ...parsedBinds
      },
    };
    
    results.bind[name] = options;

    return results;
  }

  static stringify(_: string, entries: BindSubEntry): Array<string> {
    const results: Array<string> = [];

    const keys = Object.keys(entries);

    keys.forEach((key: string) => {
      const values = entries[key];
      results.push(`${Bind.indent()}bind ${key}${values ? (' ' + values?.join(' ')).trimEnd() : ''}`);
    });

    return results;
  }
}

export default Bind;
