import NonUnique from '../../../haproxy/parsers/non-unique-keys';

describe('Haproxy parsers - NonUnique', () => {

  describe('single entry', () => {
    const parseString = '    reqadd X-Forwarded-Proto: https';
    const parseArray = [
      'reqadd',
      'X-Forwarded-Proto:',
      'https',
    ];
    const parseObj = {
      'reqadd': {
        'X-Forwarded-Proto:': ['https']
      }
    };

    it('parse', () => {
      expect(NonUnique.parse(parseArray)).toEqual(parseObj);
    });

    it('stringify', () => {
      expect(
        NonUnique.stringify('reqadd', parseObj['reqadd'])[0]
      ).toEqual(parseString);
    });
  });

  describe('multiple entries', () => {
    const parseStrings = [
      '    rspadd X-Frame-Options: SAMEORIGIN',
      '    rspadd Strict-Transport-Security: max-age=15768000'
    ];
    const parseObj = {
      'rspadd': {
        'X-Frame-Options:': ['SAMEORIGIN'],
        'Strict-Transport-Security:': ['max-age=15768000']
      }
    };

    it('parse', () => {
      let parsed: any = {};
      parseStrings.forEach((str: string) => {
        const val = str.trim().split(' ');
        parsed = NonUnique.parse(val, parsed);
      });

      expect(parsed).toEqual(parseObj);
    });

    it('stringify', () => {
      expect(
        NonUnique.stringify('rspadd', parseObj['rspadd'])
      ).toEqual(parseStrings);
    });
  });
});
