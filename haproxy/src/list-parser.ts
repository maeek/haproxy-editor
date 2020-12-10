export default class ListParser {
  content: string;
  parsedContentArray: Array<string>;

  constructor(content: string) {
    if (typeof content === 'string') {
      this.content = content;
      this.parsedContentArray = this.parse();
    } 
    else {
      this.parsedContentArray = content;
      this.content = this.toString();
    }

    return this;
  }

  toString(): string {
    return ListParser.toString(this.parsedContentArray);
  }

  static toString(parsedContentArray: string[]): string {
    return parsedContentArray.join('\n');
  }

  parse(): Array<string> {
    return ListParser.parse(this.content);
  }

  static parse(content: string): Array<string> {
    const lines = content.split('\n');

    return ListParser.clean(lines);
  }

  static clean(content: string[]): string[] {
    return content
      .map((str: string) => str.trim())
      .filter((str: string) => {
        if (str.startsWith('#') || str === '') return false;

        return str;
      });
  }
}
