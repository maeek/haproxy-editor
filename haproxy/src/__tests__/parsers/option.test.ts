import Option from '../../parsers/option';

describe('Haproxy parsers - Option', () => {
  const parseString = '    option http-keep-alive';
  const parseArray = [
    'option',
    'http-keep-alive'
  ];
  const parseObj = {
    'option http-keep-alive': true
  };

  it('parse', () => {
    expect(Option.parse(parseArray)).toEqual(parseObj);
  });

  it('stringify', () => {
    expect(
      Option.stringify('option http-keep-alive')
    ).toEqual(parseString);
  });
});
