import { cleanList } from './util/clean';

export default class ListParser {
  content!: string;
  parsedContent!: string[];

  constructor(content: string) {
    if (typeof content === 'string') {
      this.raw = content;
    } 
    else {
      this.list = content;
    }

    return this;
  }

  get raw(): string {
    return this.content;
  }

  set raw(rawContent: string) {
    this.content = rawContent;
    this.parse();
  }

  get list(): string[] {
    return this.parsedContent;
  }

  set list(parsedContent: string[]) {
    this.parsedContent = parsedContent;
    this.toString();
  }

  toString(): string {
    this.content = ListParser.toString(this.parsedContent);
    return this.content;
  }

  static toString(parsedContent: string[]): string {
    return parsedContent.join('\n');
  }

  parse(): string[] {
    this.parsedContent = ListParser.parse(this.content);
    return this.parsedContent;
  }

  static parse(content: string): string[] {
    const lines = content.split('\n');

    return cleanList(lines);
  }
}
