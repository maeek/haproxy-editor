import { HaproxyDefaults } from '../../typings';
import BasicParser from './basic';

export class DefaultParser extends BasicParser {
  constructor(contents: Array<string> | any) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = DefaultParser.parse(contents)
    } else {
      this.parsed = contents
      this.contents = DefaultParser.stringify(contents);
    }
  }

  static parse(contents: Array<string>): { defaults: HaproxyDefaults } {
    return {
      defaults: BasicParser.parse(contents)
    };
  }

  static stringify(contents: any): Array<string> {
    const key = Object.keys(contents)[0] as 'defaults';
    const values = contents[key];
    const parsed = BasicParser.stringify(values);

    return parsed.length > 0 ? [ 'defaults', ...parsed ] : [];
  }
}

export default DefaultParser;
