import Stats from '../../../haproxy/parsers/stats';

describe('Haproxy parsers - Stats', () => {
  const subParsers = [
    'stats auth',
    'stats enable',
    'stats realm',
    'stats refresh',
    'stats uri'
  ];

  const parseStrings = [
    '    stats auth Admin:password',
    '    stats enable ',
    '    stats realm Haproxy Statistics',
    '    stats refresh 20s',
    '    stats uri /admin?stats',
  ];
  const parseObj = {
    'stats auth': {
      'user': 'Admin',
      'passwd': 'password'
    },
    'stats enable': true,
    'stats realm': 'Haproxy Statistics',
    'stats refresh': ['20s'],
    'stats uri': '/admin?stats'
  } as any;

  subParsers.forEach((subparser: string, index: number) => {
    it(`parse - ${subparser}`, () => {
      expect(Stats.parse(
        parseStrings[index].trim().split(' ')
      )).toEqual({
        [subparser]: parseObj[subparser]
      });
    });

    it(`stringify - ${subparser}`, () => {
      expect(
        Stats.stringify(subparser, parseObj[subparser])
      ).toEqual(parseStrings[index]);
    });
  });
});
