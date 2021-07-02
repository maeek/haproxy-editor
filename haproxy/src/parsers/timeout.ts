import { Entry } from '../../typings';
import SingleArgument from './single-arguments';

/**
 * Input:
 * 
 *  timeout connect 10s
 *  timeout client 30s
 *  timeout server 30s
 * 
 * Output:
 * 
 *  {
 *    "timeout connect": "10s",
 *    "timeout client": "30s",
 *    "timeout server": "30s",
 *  }
 * 
 */

export class Timeout extends SingleArgument {
  static parse(arr: string[]): Entry {
    const [name, type, timeout] = arr;

    return {
      [`${name} ${type}`]: timeout
    };
  }
}

export default Timeout;
