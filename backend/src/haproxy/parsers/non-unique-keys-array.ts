import { Entry } from 'src/typings';

import Base from './base';

/**
 * Input:
 * 
 *  log /dev/log    local0
 *  log /dev/log    local1 notice
 * 
 * Output:
 * 
 *  {
 *    "log": [
 *       "/dev/log local0",
 *       "/dev/log local1 notice"
 *    ]
 *  }
 * 
 */

export class NonUniqueArray extends Base {
  static parse(arr: Array<string>, parsed?: any): Entry {
    const [name, ...rest] = arr;
    const results: string[] = [];

    if (parsed[name]) {
      results.push(...parsed[name]);
    }
    results.push(rest.join(' '));

    return {
      [`${name}`]: results
    };
  }

  static stringify(name: string, entries: Entry): Array<string> {
    const results: Array<string> = [];
    const keys = Object.keys(entries);

    keys.forEach((key: string) => {
      results.push(`${NonUniqueArray.indent()}${name} ${entries[key]}`);
    });

    return results;
  }
};

export default NonUniqueArray;
