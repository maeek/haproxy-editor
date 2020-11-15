export default class ListParser {
  content: string;
  parsedContent?: Array<Array<string>>;

  constructor(content: string) {
    this.content = content;

    return this;
  }

  parse(): Array<Array<string>> | undefined {
    const content = this.content;
    const lines = content.split('\n');

    const parsedData: Array<Array<string>> = [];

    for (let line of lines) {
      const splittedLine = line.split(new RegExp('[ ]+'));

      if (splittedLine.length > 1) parsedData.push(splittedLine);
    }

    if (this.validate(parsedData)) {
      this.parsedContent = parsedData;
      return parsedData;
    }

    return;
  }

  parseToObject(): { [key: string]: string } {
    const obj: { [key: string]: string } = {};

    if (this.parsedContent) {
      this.parsedContent.forEach(el => {
        obj[el[0]] = el[1];
      });
    }

    return obj;
  }

  validate(data?: Array<Array<string>>): boolean {
    let content = this.parsedContent;
    if (data) content = data;

    if (!content) return false;

    for (let line of content) {
      if (line.length !== 2) return false;
    }

    return true;
  }

}