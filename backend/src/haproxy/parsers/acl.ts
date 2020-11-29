import { AclEntry, AclSubEntry, HaproxyAnySection } from '../../typings';
import NonUnique from './non-unique-keys';

/**
 * Input:
 * 
 *  acl u_login path_beg /login
 *  acl smth ...
 * 
 * Output:
 * 
 *  {
 *    "acl": {
 *      "u_login": [
 *        "path_beg",
 *        "/login"
 *      ],
 *      "smth": [...]
 *    }
 *  }
 * 
 */

export class Acl extends NonUnique {
  static parse(arr: Array<string>, parsed?: HaproxyAnySection): AclEntry {
    const parsedAcls: AclSubEntry = parsed?.acl
      ? parsed.acl as AclSubEntry
      : {};

    const [, name, ...options] = arr;

    const results: AclEntry = {
      acl: {
        ...parsedAcls
      },
    };
    
    results.acl[name] = options;

    return results;
  }

  static stringify(_: string, entries: AclSubEntry): Array<string> {
    const results: Array<string> = [];

    const keys = Object.keys(entries);

    keys.forEach((key: string) => {
      const values = entries[key];
      results.push(`${Acl.indent()}acl ${key} ${values?.join(' ')}`);
    });

    return results;
  }
}

export default Acl;
