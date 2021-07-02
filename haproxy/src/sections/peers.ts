import { HaproxyCustomSectionsEnum, HaproxyPeers, HaproxyUniqueSection } from '../../typings';
import BasicParser from './generic';

export class PeersParser extends BasicParser {
  constructor(contents: string[] | HaproxyUniqueSection<HaproxyPeers>) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = PeersParser.parse(contents);
    } else {
      this.parsed = contents;
      this.contents = PeersParser.stringify(contents);
    }
  }

  static parse(contents: string[]): { [name: string]: HaproxyPeers } {
    const peersName: string = contents[0].split(' ')[1];

    return {
      [peersName]: BasicParser.parse(contents)
    };
  }

  static stringify(contents: HaproxyUniqueSection<HaproxyPeers>): string[] {
    const key = Object.keys(contents)[0] as HaproxyCustomSectionsEnum.listeners;
    const results: string[] = [];
    const keys = Object.keys(contents[key]);
    const values = Object.values(contents[key]);

    for (let i = 0; i < keys.length; i++) {
      const parsed = BasicParser.stringify(values[i]);
      const stringified: string[] = [
        `peers ${keys[i]}`,
        ...parsed,
        ''
      ];
      results.push(...(parsed.length > 0 ? stringified : []));
    }


    return results;
  }

}

export default PeersParser;
