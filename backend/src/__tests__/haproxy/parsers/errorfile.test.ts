import ErrorfileParser from '../../../haproxy/parsers/errorfile';
import { ErrorfileEntry } from '../../../typings';

describe('Haproxy parsers - Errorfile', () => {

  describe('single entry', () => {
    const parseString = '    errorfile 400 /etc/haproxy/errors-custom/400.http';
    const parseArray = [
      'errorfile',
      '400',
      '/etc/haproxy/errors-custom/400.http'
    ];
    const parseObj = {
      errorfile: {
        400: '/etc/haproxy/errors-custom/400.http'
      }
    };

    it('parse', () => {
      expect(ErrorfileParser.parse(parseArray)).toEqual(parseObj);
    });

    it('stringify', () => {
      expect(
        ErrorfileParser.stringify('', parseObj.errorfile)[0]
      ).toEqual(parseString);
    });
  });

  describe('multiple entries', () => {
    const parseStrings = [
      '    errorfile 400 /etc/haproxy/errors-custom/400.http',
      '    errorfile 401 /etc/haproxy/errors-custom/401.http',
      '    errorfile 500 /etc/haproxy/errors-custom/500.http',
      '    errorfile 501 /etc/haproxy/errors-custom/501.http'
    ];

    const parseObj: ErrorfileEntry = {
      errorfile: {
        400: '/etc/haproxy/errors-custom/400.http',
        401: '/etc/haproxy/errors-custom/401.http',
        500: '/etc/haproxy/errors-custom/500.http',
        501: '/etc/haproxy/errors-custom/501.http'
      }
    };

    it('parse', () => {
      let parsed: ErrorfileEntry = { errorfile: {} };
      parseStrings.forEach((str: string) => {
        const errorfile = str.trim().split(' ');
        parsed = ErrorfileParser.parse(errorfile, parsed);
      });

      expect(parsed).toEqual(parseObj);
    });

    it('stringify', () => {
      expect(
        ErrorfileParser.stringify('', parseObj.errorfile)
      ).toEqual(parseStrings);
    });
  });
});
