/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Entry } from '../../typings';

import Generic from './generic';

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

export class NonUniqueArray extends Generic {
  static parse(arr: string[], parsed?: any): Entry {
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

  static stringify(name: string, entries: Entry): string[] {
    const results: string[] = [];
    const keys = Object.keys(entries);

    keys.forEach((key: string) => {
      results.push(`${NonUniqueArray.indent()}${name} ${entries[key]}`);
    });

    return results;
  }
}

export default NonUniqueArray;
