import BindParser from '../../../haproxy/parsers/bind';
import { BindEntry } from '../../../typings';

describe('Haproxy parsers - Bind', () => {
  const parseStrings = [
    '    bind *:80',
    '    bind *:443 ssl crt /certs/pem/'
  ];

  const parseObj: BindEntry = {
    bind: {
      '*:80': [],
      '*:443': [
        'ssl',
        'crt',
        '/certs/pem/'
      ]
    }
  };

  it('parse', () => {
    let parsed: any = { bind: {} };
    parseStrings.forEach((str: string) => {
      parsed = BindParser.parse(str.trim().split(' '), parsed);
    });

    expect(parsed).toEqual(parseObj);
  });

  it('stringify', () => {
    expect(
      BindParser.stringify('', parseObj.bind)
    ).toEqual(parseStrings);
  });
});
