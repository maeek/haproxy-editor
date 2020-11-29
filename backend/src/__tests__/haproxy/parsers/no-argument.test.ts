import NoArgParser from '../../../haproxy/parsers/no-argument';

describe('Haproxy parsers - NoArgument', () => {
  const parseString = '    daemon';
  const parseArray = ['daemon'];
  const parseObj = {
    daemon: true
  };

  it('parse', () => {
    expect(NoArgParser.parse(parseArray)).toEqual(parseObj);
  });

  it('stringify', () => {
    expect(
      NoArgParser.stringify('daemon')
    ).toEqual(parseString);
  });
});
