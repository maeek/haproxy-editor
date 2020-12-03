import HttpResponseParser from '../../../haproxy/parsers/http-response';

describe('Haproxy parsers - HttpResponse', () => {

  describe('single entry', () => {
    const parseString = '    http-response replace-value Set-Cookie (.*) 1; Secure';
    const parseArray = [
      'http-response',
      'replace-value',
      'Set-Cookie',
      '(.*)',
      '1;',
      'Secure'
    ];
    const parseObj = {
      'http-response': {
        'replace-value': [
          [
            'Set-Cookie',
            '(.*)',
            '1;',
            'Secure'
          ]
        ]
      }
    };

    it('parse', () => {
      expect(HttpResponseParser.parse(parseArray)).toEqual(parseObj);
    });

    it('stringify', () => {
      expect(
        HttpResponseParser.stringify('', parseObj['http-response'])[0]
      ).toEqual(parseString);
    });
  });
});
