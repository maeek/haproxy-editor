import { Entry, StandardEntry } from '../../typings';
import Base from './base';

export class SingleArgument extends Base {
  static parse(arr: Array<string>): Entry {
    const [option, ...value] = arr;

    return {
      [option]: value.join(' ')
    };
  }

  static stringify(key: string, entry?: StandardEntry): string {
    return `${SingleArgument.indent()}${key} ${Array.isArray(entry) ? entry.join(' ') : entry}`;
  }
};

export default SingleArgument;
