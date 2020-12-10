import { Entry, StandardEntry } from '../../typings';
import Base from './base';

/**
 * Input:
 * 
 *  chroot /var/lib/haproxy
 * 
 * Output:
 * 
 *  {
 *    "chroot": "/var/lib/haproxy"
 *  }
 * 
 */

export class SingleArgument extends Base {
  static parse(arr: Array<string>): Entry {
    const [option, ...value] = arr;

    let val: string | number = value.join(' ');

    const parsedNumber = parseInt(value.join(' '), 10);
    if (!isNaN(parsedNumber)) {
      val = parsedNumber;
    }
    

    return {
      [option]: val
    };
  }

  static stringify(key: string, entry?: StandardEntry): string {
    return `${SingleArgument.indent()}${key} ${Array.isArray(entry) ? entry.join(' ') : entry}`;
  }
}

export default SingleArgument;
