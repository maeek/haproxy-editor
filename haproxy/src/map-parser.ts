import { Entry } from '../typings';

export default class MapParser {
  content!: string;
  parsedContentArray!: Array<Array<string>>;
  parsedContentObj!: Entry;

  constructor(content: string) {
    if (typeof content === 'string') {
      this.content = content;
      this.parse();
      this.parseToObject();
    } 
    else if (Array.isArray(content)) {
      this.parsedContentArray = content;
      this.toString();
      this.parseToObject();
    } else {
      this.parsedContentObj = content;
      this.parseFromObject();
      this.toString();
    }

    return this;
  }

  toString(): string {
    this.content = MapParser.toString(this.parsedContentArray);
    return this.content;
  }

  static toString(parsedContentArray: string[][]): string {
    const longestWord = Math.max(...(parsedContentArray.map((entry: string[]) => entry[0].length)));

    return parsedContentArray.map((entry: string[]) => {
      const indent = longestWord - entry[0].length;

      return entry.join(new Array(indent + 5).join(' '));
    }).join('\n');
  }

  parse(): Array<Array<string>> {
    this.parsedContentArray = MapParser.parse(this.content);
    return this.parsedContentArray;
  }

  static parse(content: string): Array<Array<string>> {
    const lines = content.split('\n');

    const parsedData: Array<Array<string>> = [];

    for (const line of lines) {
      const splittedLine = line.split(new RegExp('[ ]+'));

      if (splittedLine.length > 1) parsedData.push(splittedLine);
    }

    if (MapParser.validate(parsedData)) {
      return parsedData;
    }

    return [];
  }

  parseFromObject(): Array<Array<string>> {
    this.parsedContentArray = MapParser.parseFromObject(this.parsedContentObj);
    return this.parsedContentArray;
  }

  static parseFromObject(parsedContentObj: Entry): Array<Array<string>> {
    const results: Array<Array<string>> = [];
    const keys = Object.keys(parsedContentObj);
    const values = Object.values(parsedContentObj);

    for (let i = 0; i < keys.length; i++) {
      results.push([
        keys[i],
        (values[i] as string)
      ]);
    }

    return results;
  }

  parseToObject(): Entry {
    this.parsedContentObj = MapParser.parseToObject(this.parsedContentArray);
    return this.parsedContentObj;
  }

  static parseToObject(parsedContentArray: Array<Array<string>>): Entry {
    const obj: Entry = {};

    if (parsedContentArray) {
      parsedContentArray.forEach(el => {
        obj[el[0]] = el[1];
      });
    }

    return obj;
  }

  static validate(data?: Array<Array<string>>): boolean {
    if (!data) return false;

    for (const line of data) {
      if (line.length !== 2) return false;
    }

    return true;
  }
}