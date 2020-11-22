import { HaproxyGlobal } from '../../typings';
import BasicParser from './basic';

export class GlobalParser extends BasicParser {
  constructor(contents: Array<string> | any) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = GlobalParser.parse(contents)
    } else {
      this.parsed = contents
      this.contents = GlobalParser.stringify(contents);
    }
  }

  static parse(contents: Array<string>): { global: HaproxyGlobal } {
    return {
      global: BasicParser.parse(contents)
    };
  }
}

export default GlobalParser;
