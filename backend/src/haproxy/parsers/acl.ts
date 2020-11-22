import { AclSubEntry, AclEntry } from '../../typings';
import Base from './base';

export class Acl extends Base {
  static parse(arr: Array<string>, parsed?: any): AclEntry { // TODO change any
    const parsedAcls: AclSubEntry = parsed?.acl
      ? parsed.acl
      : {};

    const [_, name, ...options] = arr;

    const results: AclEntry = {
      acl: {
        ...parsedAcls
      },
    };
    
    results.acl[name] = options;

    return results;
  }

  static stringify(_: string, entries: AclSubEntry): Array<string> {
    let results: Array<string> = [];

    const keys = Object.keys(entries);

    keys.forEach((key: string) => {
      const values = entries[key];
      results.push(`${Acl.indent()}acl ${key} ${values?.join(' ')}`);
    });

    return results;
  }
};

export default Acl;
