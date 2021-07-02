import { HaproxyConfig, HaproxyCustomSectionsEnum, HaproxyFrontend, HaproxyUniqueSection } from '../../typings';
import BasicParser from './generic';

export class FrontendParser extends BasicParser {
  constructor(contents: string[] | HaproxyConfig) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = FrontendParser.parse(contents);
    } else {
      this.parsed = contents;
      this.contents = FrontendParser.stringify(contents as HaproxyUniqueSection<HaproxyFrontend>);
    }
  }

  static parse(contents: string[]): HaproxyUniqueSection<HaproxyFrontend> {
    const frontendName: string = contents[0].split(' ')[1];

    return {
      [frontendName]: BasicParser.parse(contents)
    };
  }

  static stringify(contents: HaproxyUniqueSection<HaproxyFrontend>): string[] {
    const key = Object.keys(contents)[0] as HaproxyCustomSectionsEnum.frontends;
    const results: string[] = [];
    const keys = Object.keys(contents[key]);
    const values = Object.values(contents[key]);

    for (let i = 0; i < keys.length; i++) {
      const parsed = BasicParser.stringify(values[i]);
      const stringified: string[] = [
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
