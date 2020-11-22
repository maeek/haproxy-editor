import DaemonParser from '../../../haproxy/parsers/daemon';

describe('Haproxy parsers - Daemon', () => {
  const parseString = '    daemon';
  const parseArray = [
    'daemon'
  ];
  const parseObj = {
    daemon: true
  }

  it('parse', () => {
    expect(DaemonParser.parse(parseArray)).toEqual(parseObj);
  });

  it('stringify', () => {
    expect(
      DaemonParser.stringify('daemon')
    ).toEqual(parseString);
  });
});
