import { ErrorfileEntry, ErrorfileEntryGroup, HaproxyDefaults } from '../../typings';

export const errorfileParser = (arr: Array<string>, alreadyParsed?: HaproxyDefaults): ErrorfileEntryGroup => { // TODO maybe not pass whole HaproxyDefaults
    const [_, code, path] = arr;
    const newErrorfile: ErrorfileEntry = {
      [code]: path
    };

    return {
      errorfile: [
        ...(alreadyParsed?.errorfile ? alreadyParsed.errorfile : []),
        newErrorfile
      ]
    };
  }

export default errorfileParser;
