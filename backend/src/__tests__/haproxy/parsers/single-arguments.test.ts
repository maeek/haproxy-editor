import SingleArgumentParser from '../../../haproxy/parsers/single-arguments';

describe('Haproxy parsers - SingleArgument', () => {
  const parseString = '    mode http';
  const parseArray = [
    'mode',
    'http'
  ];
  const parseObj = {
    mode: 'http'
  };

  it('parse', () => {
    expect(SingleArgumentParser.parse(parseArray)).toEqual(parseObj);
  });

  it('stringify', () => {
    expect(
      SingleArgumentParser.stringify('mode', parseObj.mode)
    ).toEqual(parseString);
  });
});
