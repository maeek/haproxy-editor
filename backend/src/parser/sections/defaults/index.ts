import { HaproxyDefaults } from '../../../typings';
import { selectParser } from '../../select-parser';

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

      const parser = selectParser(arr[0]);
      const parsedRow = parser(arr, result);

      result = {
        ...result,
        ...parsedRow
      }
    }

    return result;
  }

}

export default DefaultParser;
