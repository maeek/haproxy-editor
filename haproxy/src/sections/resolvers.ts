import { HaproxyCustomSectionsEnum, HaproxyResolvers, HaproxyUniqueSection } from '../../typings';
import BasicParser from './generic';

export class ResolversParser extends BasicParser {
  constructor(contents: string[] | HaproxyUniqueSection<HaproxyResolvers>) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = ResolversParser.parse(contents);
    } else {
      this.parsed = contents;
      this.contents = ResolversParser.stringify(contents);
    }
  }

  static parse(contents: string[]): { [name: string]: HaproxyResolvers } {
    const resolversName: string = contents[0].split(' ')[1];

    return {
      [resolversName]: BasicParser.parse(contents)
    };
  }

  static stringify(contents: HaproxyUniqueSection<HaproxyResolvers>): string[] {
    const key = Object.keys(contents)[0] as HaproxyCustomSectionsEnum.listeners;
    const results: string[] = [];
    const keys = Object.keys(contents[key]);
    const values = Object.values(contents[key]);

    for (let i = 0; i < keys.length; i++) {
      const parsed = BasicParser.stringify(values[i]);
      const stringified: string[] = [
        `resolvers ${keys[i]}`,
        ...parsed,
        ''
      ];
      results.push(...(parsed.length > 0 ? stringified : []));
    }


    return results;
  }

}

export default ResolversParser;
