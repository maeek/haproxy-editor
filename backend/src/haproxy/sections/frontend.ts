import { HaproxyCustomSectionsEnum, HaproxyFrontend, HaproxyUniqueSection } from '../../typings';
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

  static stringify(contents: HaproxyUniqueSection<HaproxyFrontend>): Array<string> {
    const key = Object.keys(contents)[0] as HaproxyCustomSectionsEnum.frontends;
    const results: string[] = [];
    const keys = Object.keys(contents[key]);
    const values = Object.values(contents[key]);

    for (let i = 0; i < keys.length; i++) {
      const parsed = BasicParser.stringify(values[i]);
      const stringified: Array<string> = [
        `frontend ${keys[i]}`,
        ...parsed,
        ''
      ];
      results.push(...(parsed.length > 0 ? stringified : []));
    }


    return results;
  }

}

export default FrontendParser;
