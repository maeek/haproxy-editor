/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entry, HaproxyAnySection, StandardEntry } from '../../typings';

import Base from './base';

/**
 * Input:
 * 
 *  rspadd X-Frame-Options: SAMEORIGIN
 *  rspadd Strict-Transport-Security: max-age=15768000
 * 
 * Output:
 * 
 *  {
 *    "rspadd": {
 *        "X-Frame-Options:": [
 *            "SAMEORIGIN"
 *        ],
 *        "Strict-Transport-Security:": [
 *            "max-age=15768000"
 *        ]
 *     }
 *  }
 * 
 */

export class NonUnique extends Base {
  static parse(arr: Array<string>, parsed?: HaproxyAnySection): any { // TODO change any    
    const [key, method, ...options] = arr;
    const parsedNonUnique = parsed && parsed[key]
      ? parsed[key] as Entry
      : {};
    const nonUniqueOptions: StandardEntry = options;

    const results: { [key: string]: Entry } = {
      [key]: {
        ...parsedNonUnique
      },
    };
    
    if (results[key]) {
      if(!results[key][method as string]) {
        results[key][method as string] = [];
      }

      if (nonUniqueOptions.length > 0) {
        (results[key][method as string] as Array<string | number>)?.push(nonUniqueOptions.join(' '));
      }
    }
    
    return results;
  }

  static stringify(name: string, entries: Entry): Array<string> {
    const results: Array<string> = [];

    const keys = Object.keys(entries);

    keys.forEach((key: string) => {
      const values = entries[key as string];
      (values as string[][])?.forEach((val: string[]) => {
        results.push(`${NonUnique.indent()}${name} ${key} ${Array.isArray(val) ? val.join(' ') : val}`);
      });
    });

    return results;
  }
}

export default NonUnique;
