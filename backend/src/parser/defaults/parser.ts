import { HaproxyCustomParsers } from '../../const';
import { ErrorfileEntry, ErrorfileEntryList, ErrorfileEntryGroup, HaproxyDefaults, StandardEntry } from '../../typings';

export class DefaultParser {
  parsedSection?: HaproxyDefaults;
  defaultsContent?: Array<string>;

  constructor(defaultsContent: Array<string>) {
    this.defaultsContent = defaultsContent;
    this.parsedSection = DefaultParser.parse(defaultsContent)
  }

  get data() {
    return this.parsedSection;
  }

  get rawData() {
    return this.defaultsContent;
  }

  static parse(defaultsContent: Array<string>): HaproxyDefaults {
    let result: any = {
    };
  
    for (let i = 1; i < defaultsContent.length; i++) {
      const line = defaultsContent[i];
      const arr: Array<string> = line.split(' ');

      const parser = DefaultParser.selectParser(arr[0]);
      const parsedRow = parser(arr, result);

      result = {
        ...result,
        ...parsedRow
      }
    }

    return result;
  }

  static selectParser(type: string) {
    const parsers = {
      [HaproxyCustomParsers.timeout]: DefaultParser.timeoutParser,
      [HaproxyCustomParsers.errorfile]: DefaultParser.errorfileParser
    };

    return parsers[type] || DefaultParser.basicParser;
  }

  static timeoutParser(arr: Array<string>): {[key: string]: StandardEntry} {
    const [name, type, timeout] = arr;

    return {
      [`${name} ${type}`]: timeout
    };
  }

  static errorfileParser(arr: Array<string>, alreadyParsed?: HaproxyDefaults): ErrorfileEntryGroup {
    const [_, code, path] = arr;
    const newErrorfile: ErrorfileEntry = {
      [code]: path
    };

    let results: ErrorfileEntryList = [
      ...(alreadyParsed?.errorfile ? alreadyParsed.errorfile : []),
      newErrorfile
    ];

    return {
      errorfile: results
    };
  }

  static basicParser(arr: Array<string>): {[key: string]: StandardEntry} {
    const [option, ...values] = arr;

    return {
      [option]: values
    }
  }
}

export default DefaultParser;
