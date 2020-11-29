/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapParser } from '../map-setting-to-parser';

export abstract class BasicParser {
  parsed?: any;
  contents?: Array<string>;

  constructor(contents: Array<string> | any) {
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = BasicParser.parse(contents);
    } else {
      this.parsed = contents;
      this.contents = BasicParser.stringify(contents);
    }
  }

  get data(): any {
    return this.parsed;
  }

  get rawData(): string[] | undefined {
    return this.contents;
  }

  static parse(contents: Array<string>): any {
    let result: any = {};
  
    for (let i = 1; i < contents.length; i++) {
      const line = contents[i];
      const arr = line.split(' ');

      const Parser = mapParser(arr[0]);
      const parsedRow: any = Parser.parse(arr, result);

      result = {
        ...result,
        ...parsedRow
      };
    }

    return result;
  }

  static json(contents: any): string {
    return JSON.stringify(contents);
  }

  static stringify(contents: any): Array<string> {
    const results = [];
    const keys = Object.keys(contents);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = contents[key];

      const Parser = mapParser(key);
      const parsedRow = Parser.stringify(key, value);

      if (Array.isArray(parsedRow)) {
        parsedRow.forEach((row: string) => {
          results.push(row);
        });
      } else {
        results.push(parsedRow);
      }
    }

    return results;
  }

  static toString(contents: Array<string>): string {
    let str = '';

    contents.forEach((line: string) => {
      str += `${line}\n`;
    });

    return str;
  }
}

export default BasicParser;
