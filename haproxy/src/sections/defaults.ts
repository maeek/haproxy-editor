import { HaproxyConfig, HaproxyCustomSectionsEnum } from '../../typings';
import BasicParser from './generic';

export class DefaultParser extends BasicParser {
  constructor(contents: string[] | HaproxyConfig) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = DefaultParser.parse(contents);
    } else {
      this.parsed = contents;
      this.contents = DefaultParser.stringify(contents);
    }
  }

  static parse(contents: string[]): HaproxyConfig {
    return {
      defaults: BasicParser.parse(contents)
    };
  }

  static stringify(contents: HaproxyConfig): string[] {
    const key = Object.keys(contents)[0] as HaproxyCustomSectionsEnum.defaults;
    const values = contents[key];
    const parsed = BasicParser.stringify(values);

    return parsed.length > 0 ? ['defaults', ...parsed] : [];
  }
}

export default DefaultParser;
