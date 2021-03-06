export enum logLevels {
  'off' = 0,
  'verbose' = 1,
  'debug' = 2
}

export class Logger {
  logLevel: logLevels = logLevels.off;

  constructor(logLevel?: logLevels) {
    if (logLevel) {
      this.logLevel = logLevel;
    } else {
      if (process.env.MODE === 'development') {
        this.logLevel = logLevels.debug;
      } else {
        this.logLevel = logLevels.off;
      }
    }

    return this;
  }

  log(message: string, force?: boolean): void {
    if (this.logLevel > 1 || force) {
      console.log(`[${this._printDate()}]  INFO  "${message}"`);
    } 
  }

  warning(message: string, force?: boolean): void {
    if (this.logLevel > 0 || force) {
      console.log(`[${this._printDate()}]  WARNING  "${message}"`);
    } 
  }

  error(message: string, errorObj: NodeJS.ErrnoException, force?: boolean): void {
    if (this.logLevel > 0 || force) {
      console.error(`[${this._printDate()}]  ERROR  "${message}, stack: ${errorObj.stack?.split('\n').join(' ')}"`);
    } 
  }

  _printDate(): string {
    return new Date().toLocaleString(); // TODO - change log date format
  }

}

export default new Logger();
