/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { mapParser } from '../map-setting-to-parser';

import ParsersFactory from '../ParsersFactory';

export abstract class BasicParser {
  protected parsed?: any;
  protected contents?: string[];

  constructor(contents: string[] | any) {
    if (Array.isArray(contents)) {
      this.contents = contents;
      this.parsed = BasicParser.parse(contents);
    } else {
      this.parsed = contents;
      this.contents = BasicParser.stringify(contents);
    }
  }

  get config(): any {
    return this.parsed;
  }

  get rawConfig(): string[] | undefined {
    return this.contents;
  }

  static parse(contents: string[]): any {
    let result: any = {};
  
    for (let i = 1; i < contents.length; i++) {
      const line = contents[i];
      const arr = line.split(' ');

      const Parser = ParsersFactory.getParser(arr[0]);
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

  static stringify(contents: any): string[] {
    const results = [];
    const keys = Object.keys(contents);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = contents[key];

      const Parser = ParsersFactory.getParser(key);
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

  static toString(contents: string[]): string {
    let str = '';

    contents.forEach((line: string) => {
      str += `${line}\n`;
    });

    return str;
  }
}

export default BasicParser;
