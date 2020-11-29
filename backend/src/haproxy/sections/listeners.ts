import { HaproxyCustomSectionsEnum, HaproxyListen, HaproxyUniqueSection } from '../../typings';
import BasicParser from './basic';

export class ListenerParser extends BasicParser {
  constructor(contents: Array<string> | any) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = ListenerParser.parse(contents)
    } else {
      this.parsed = contents
      this.contents = ListenerParser.stringify(contents);
    }
  }

  static parse(contents: Array<string>): { [name: string]: HaproxyListen } {
    const listenerName: string = contents[0].split(' ')[1];

    return {
      [listenerName]: BasicParser.parse(contents)
    };
  }

  static stringify(contents: HaproxyUniqueSection<HaproxyListen>): Array<string> {
    const key = Object.keys(contents)[0] as HaproxyCustomSectionsEnum.listeners;
    const results: string[] = [];
    const keys = Object.keys(contents[key]);
    const values = Object.values(contents[key]);

    for (let i = 0; i < keys.length; i++) {
      const parsed = BasicParser.stringify(values[i]);
      const stringified: Array<string> = [
        `listen ${keys[i]}`,
        ...parsed,
        ''
      ];
      results.push(...(parsed.length > 0 ? stringified : []));
    }


    return results;
  }

}

export default ListenerParser;
