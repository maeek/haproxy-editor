import { ErrorfileEntry, ErrorfileEntryList, ErrorfileSubEntry } from '../../typings';
import Base from './base';

export class Errorfile extends Base {
  static parse(arr: Array<string>, parsed?: any): ErrorfileEntry { // TODO change any
    const parsedErrorfiles: ErrorfileEntryList = parsed?.errorfile 
      ? parsed.errorfile
      : [];

    const [_, code, path] = arr;
    const newErrorfile: ErrorfileSubEntry = {
      [code]: path
    };

    return {
      errorfile: [
        ...parsedErrorfiles,
        newErrorfile
      ]
    };
  }

  static stringify(_: string, entries: ErrorfileEntryList): Array<string> {
    let results: Array<string> = [];

    entries.forEach((entry: ErrorfileSubEntry) => {
      const key = Object.keys(entry)[0];
      results.push(`${Errorfile.indent()}errorfile ${key} ${entry[key]}`);
    });

    return results;
  }
};

export default Errorfile;
