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

  static stringify(contents: { defaults: HaproxyDefaults }): Array<string> {
    return BasicParser.stringify(contents);
  }

}

export default DefaultParser;
