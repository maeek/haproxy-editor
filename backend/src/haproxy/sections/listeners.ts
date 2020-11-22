import { HaproxyListenEntry, HaproxyListen } from '../../typings';
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

  static stringify(contents: HaproxyListenEntry): Array<string> {
    const key = Object.keys(contents)[0] as 'name';

    const stringified: Array<string> = BasicParser.stringify(contents[key]);

    return [
      `backend ${key}`,
      ...stringified
    ];
  }

}

export default ListenerParser;
