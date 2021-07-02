import { HaproxyCustomSectionsEnum, HaproxyUserlist, HaproxyUniqueSection } from '../../typings';
import BasicParser from './generic';

export class UserlistParser extends BasicParser {
  constructor(contents: string[] | HaproxyUniqueSection<HaproxyUserlist>) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = UserlistParser.parse(contents);
    } else {
      this.parsed = contents;
      this.contents = UserlistParser.stringify(contents);
    }
  }

  static parse(contents: string[]): { [name: string]: HaproxyUserlist } {
    const userlistName: string = contents[0].split(' ')[1];

    return {
      [userlistName]: BasicParser.parse(contents)
    };
  }

  static stringify(contents: HaproxyUniqueSection<HaproxyUserlist>): string[] {
    const key = Object.keys(contents)[0] as HaproxyCustomSectionsEnum.listeners;
    const results: string[] = [];
    const keys = Object.keys(contents[key]);
    const values = Object.values(contents[key]);

    for (let i = 0; i < keys.length; i++) {
      const parsed = BasicParser.stringify(values[i]);
      const stringified: string[] = [
        `userlist ${keys[i]}`,
        ...parsed,
        ''
      ];
      results.push(...(parsed.length > 0 ? stringified : []));
    }


    return results;
  }

}

export default UserlistParser;
