import TimeoutParser from '../../../haproxy/parsers/timeout';

describe('Haproxy parsers - Timeout', () => {
  const parseString = '    timeout client 10s';
  const parseArray = [
    'timeout',
    'client',
    '10s'
  ];
  const parseObj = {
    'timeout client': '10s'
  }

  it('parse', () => {
    expect(TimeoutParser.parse(parseArray)).toEqual(parseObj);
  });

  it('stringify', () => {
    expect(
      TimeoutParser.stringify('timeout client', parseObj['timeout client'])
    ).toEqual(parseString);
  });
});
