import { HaproxyBackend, HaproxyConfig, HaproxyUniqueSection } from '../../typings';
import BasicParser from './generic';

export class BackendParser extends BasicParser {
  constructor(contents: string[] | HaproxyConfig) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = BackendParser.parse(contents);
    } else {
      this.parsed = contents;
      this.contents = BackendParser.stringify(contents as HaproxyUniqueSection<HaproxyBackend>);
    }
  }

  static parse(contents: string[]): HaproxyUniqueSection<HaproxyBackend> {
    const backendName: string = contents[0].split(' ')[1];

    return {
      [backendName]: BasicParser.parse(contents)
    };
  }

  static stringify(contents: HaproxyUniqueSection<HaproxyBackend>): string[] {
    const key = Object.keys(contents)[0];
    const results: string[] = [];
    const keys = Object.keys(contents[key]);
    const values = Object.values(contents[key]);

    for (let i = 0; i < keys.length; i++) {
      const parsed = BasicParser.stringify(values[i]);
      const stringified: string[] = [
        `backend ${keys[i]}`,
        ...parsed,
        ''
      ];
      results.push(...(parsed.length > 0 ? stringified : []));
    }

    return results;
  }
}

export default BackendParser;
