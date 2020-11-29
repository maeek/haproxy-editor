import { HaproxyConfig, HaproxyCustomSectionsEnum, HaproxyGlobal } from '../../typings';
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

  static parse(contents: Array<string>): HaproxyConfig {
    return {
      global: BasicParser.parse(contents)
    };
  }

  static stringify(contents: HaproxyConfig): Array<string> {
    const key = Object.keys(contents)[0] as HaproxyCustomSectionsEnum.global;
    const values = contents[key];
    const parsed = BasicParser.stringify(values);

    return parsed.length > 0 ? [ 'global', ...parsed ] : [];
  }
}

export default GlobalParser;
