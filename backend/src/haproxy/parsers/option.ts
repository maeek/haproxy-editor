import { Entry } from '../../typings';
import NoArgument from './no-argument';

/**
 * Input:
 * 
 *   option http-keep-alive
 *   option dontlognull
 *   option forwardfor
 *   option http-server-close
 * 
 * Output:
 * 
 *   {
 *     "option http-keep-alive": true,
 *     "option dontlognull": true,
 *     "option forwardfor": true,
 *     "option http-server-close": true
 *   }
 * 
 */

export class Option extends NoArgument {
  static parse(arr: Array<string>): Entry {
    const [name, type] = arr;

    return {
      [`${name} ${type}`]: true
    };
  }

  static stringify(key: string): string {
    return NoArgument.indent() + key;
  }
};

export default Option;
