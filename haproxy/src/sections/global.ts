import { HaproxyConfig, HaproxyCustomSectionsEnum } from '../../typings';
import BasicParser from './generic';

export class GlobalParser extends BasicParser {
  constructor(contents: string[] | HaproxyConfig) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = GlobalParser.parse(contents);
    } else {
      this.parsed = contents;
      this.contents = GlobalParser.stringify(contents);
    }
  }

  static parse(contents: string[]): HaproxyConfig {
    return {
      global: BasicParser.parse(contents)
    };
  }

  static stringify(contents: HaproxyConfig): string[] {
    const key = Object.keys(contents)[0] as HaproxyCustomSectionsEnum.global;
    const values = contents[key];
    const parsed = BasicParser.stringify(values);

    return parsed.length > 0 ? ['global', ...parsed] : [];
  }
}

export default GlobalParser;
