import { Entry, StandardEntry } from '../../typings';
import SingleArgument from './single-arguments';

export class Timeout extends SingleArgument {
  static parse(arr: Array<string>): Entry {
    const [name, type, timeout] = arr;

    return {
      [`${name} ${type}`]: timeout
    };
  }
};

export default Timeout;

