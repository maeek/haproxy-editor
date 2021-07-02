import { Entry } from '../../typings';
import SingleArgument from './single-arguments';

/**
 * Input:
 * 
 *   daemon
 * 
 * Output:
 * 
 *   {
 *     "daemon": true
 *   }
 * 
 */

export class NoArgument extends SingleArgument {
  static parse(arr: string[]): Entry {
    const [option] = arr;

    return {
      [option]: true
    };
  }

  static stringify(key: string): string {
    return NoArgument.indent() + key;
  }
}

export default NoArgument;
