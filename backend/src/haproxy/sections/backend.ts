import { HaproxyBackendEntry, HaproxyBackend } from '../../typings';
import BasicParser from './basic';

export class BackendParser extends BasicParser {
  constructor(contents: Array<string> | any) {
    super(contents);
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = BackendParser.parse(contents)
    } else {
      this.parsed = contents
      this.contents = BackendParser.stringify(contents);
    }
  }

  static parse(contents: Array<string>): { [name: string]: HaproxyBackend } {
    const backendName: string = contents[0].split(' ')[1];

    return {
      [backendName]: BasicParser.parse(contents)
    };
  }

  static json() {}

  static stringify(contents: HaproxyBackendEntry): Array<string> {
    const key = Object.keys(contents)[0] as 'name';

    const stringified: Array<string> = BasicParser.stringify(contents[key]);

    return [
      `backend ${key}`,
      ...stringified
    ];
  }

}

export default BackendParser;
