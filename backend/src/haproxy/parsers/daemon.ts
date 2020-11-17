import { Entry } from '../../typings';
import SingleArgument from './single-arguments';

export class Daemon extends SingleArgument {
  static parse(arr: Array<string>): Entry {
    const [option] = arr;

    return {
      [option]: true
    };
  }

  static stringify(key: string): string {
    return Daemon.indent() + key;
  }
};

export default Daemon;
