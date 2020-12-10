import MultipleArgumentParser from '../../parsers/multiple-arguments';

describe('Haproxy parsers - MultipleArgument', () => {
  const parseString = '    bind *:443 ssl crt /certs/pem/';
  const parseArray = [
    'bind',
    '*:443',
    'ssl',
    'crt',
    '/certs/pem/'
  ];
  const parseObj = {
    bind: [
      '*:443',
      'ssl',
      'crt',
      '/certs/pem/'
    ]
  };

  it('parse', () => {
    expect(MultipleArgumentParser.parse(parseArray)).toEqual(parseObj);
  });

  it('stringify', () => {
    expect(
      MultipleArgumentParser.stringify('bind', parseObj.bind)
    ).toEqual(parseString);
  });
});
