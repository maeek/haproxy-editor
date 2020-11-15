import { HaproxyCustomParsers } from '../../const';
import { ErrorfileEntry, ErrorfileEntryList, ErrorfileEntryGroup, HaproxyDefaults, StandardEntry } from '../../typings';

export class DefaultParser {
  parsedSection: HaproxyDefaults;

  constructor(defaultsContent: Array<string>) {
    this.parsedSection = DefaultParser.parse(defaultsContent)
  }

  get data() {
    return this.parsedSection;
  }

  static parse(defaultsContent: Array<string>): HaproxyDefaults {
    const result: any = {
      defaults: {}
    };
  
    for (let i = 1; i < defaultsContent.length; i++) {
      const line = defaultsContent[i];
      const arr: Array<string> = line.split(' ');

      const parser = DefaultParser.selectParser(arr[0]);
      const parsedRow = parser(arr, result);

      
      result.defaults = {
        ...result.defaults,
        ...parsedRow
      }
    }
    
    return result;
  }

  static selectParser(type: string) {
    switch (type) {
      case HaproxyCustomParsers.timeout:
        return DefaultParser.timeoutParser;
      case HaproxyCustomParsers.errorfile:
        return DefaultParser.errorfileParser;
      default:
        return DefaultParser.basicParser;
    }
  }

  static timeoutParser(arr: Array<string>): {[key: string]: StandardEntry} {
    const [name, type, timeout] = arr;

    return {
      [`${name} ${type}`]: timeout
    };
  }

  static errorfileParser(arr: Array<string>, alreadyParsed?: HaproxyDefaults): ErrorfileEntryGroup {
    const [name, code, path] = arr;
    const newErrorfile: ErrorfileEntry = {
      [name]: {
        code,
        path
      }
    };

    let results: ErrorfileEntryList = [];

    if (alreadyParsed?.defaults?.errorfile) {
      results = [
        ...alreadyParsed.defaults.errorfile,
        newErrorfile
      ]
    } else {
      results = [newErrorfile];
    }


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
