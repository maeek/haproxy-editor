export interface Generic {
  indent(): string;
  parse(): any;
  stringify(): string[];
}

export class Generic implements Generic {
  static indent(): string {
    return '    ';
  }
}

export default Generic;
