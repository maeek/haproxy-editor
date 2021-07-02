import { HaproxyCustomSectionsEnum, HaproxyMailers, HaproxyUniqueSection } from '../../typings';
import BasicParser from './generic';

export class MailersParser extends BasicParser {
  constructor(contents: string[] | HaproxyUniqueSection<HaproxyMailers>) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = MailersParser.parse(contents);
    } else {
      this.parsed = contents;
      this.contents = MailersParser.stringify(contents);
    }
  }

  static parse(contents: string[]): { [name: string]: HaproxyMailers } {
    const mailersName: string = contents[0].split(' ')[1];

    return {
      [mailersName]: BasicParser.parse(contents)
    };
  }

  static stringify(contents: HaproxyUniqueSection<HaproxyMailers>): string[] {
    const key = Object.keys(contents)[0] as HaproxyCustomSectionsEnum.listeners;
    const results: string[] = [];
    const keys = Object.keys(contents[key]);
    const values = Object.values(contents[key]);

    for (let i = 0; i < keys.length; i++) {
      const parsed = BasicParser.stringify(values[i]);
      const stringified: string[] = [
        `mailers ${keys[i]}`,
        ...parsed,
        ''
      ];
      results.push(...(parsed.length > 0 ? stringified : []));
    }


    return results;
  }

}

export default MailersParser;
