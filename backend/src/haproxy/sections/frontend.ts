import { HaproxyDefaults, HaproxyFrontend, HaproxyFrontendEntry } from '../../typings';
import BasicParser from './basic';

export class FrontendParser extends BasicParser {
  constructor(contents: Array<string> | any) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = FrontendParser.parse(contents)
    } else {
      this.parsed = contents
      this.contents = FrontendParser.stringify(contents);
    }
  }

  static parse(contents: Array<string>): { [name: string]: HaproxyFrontend } {
    const frontendName: string = contents[0].split(' ')[1];

    return {
      [frontendName]: BasicParser.parse(contents)
    };
  }

  static json() {}

  static stringify(contents: HaproxyFrontendEntry): Array<string> {
    const key = Object.keys(contents)[0] as 'name';

    const stringified: Array<string> = BasicParser.stringify(contents[key]);

    return [
      `frontend ${key}`,
      ...stringified
    ];
  }

}

export default FrontendParser;
