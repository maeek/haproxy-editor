import HttpRequestParser from '../../../haproxy/parsers/http-request';
import { HttpRequestResponseEntry } from '../../../typings';

describe('Haproxy parsers - HttpRequest', () => {

  describe('single entry', () => {
    const parseString = '    http-request redirect code 301 location https://example.com unless { hdr_end(host) -i example.com }';
    const parseArray = [
      'http-request',
      'redirect',
      'code',
      '301',
      'location',
      'https://example.com',
      'unless',
      '{',
      'hdr_end(host)',
      '-i',
      'example.com',
      '}'
    ];
    const parseObj = {
      'http-request': {
        redirect: [
          [
            'code',
            '301',
            'location',
            'https://example.com',
            'unless',
            '{',
            'hdr_end(host)',
            '-i',
            'example.com',
            '}'
          ]
        ]
      }
    };

    it('parse', () => {
      expect(HttpRequestParser.parse(parseArray)).toEqual(parseObj);
    });

    it('stringify', () => {
      expect(
        HttpRequestParser.stringify('', parseObj['http-request'])[0]
      ).toEqual(parseString);
    });
  });

  describe('multiple entries', () => {
    const parseStrings = [
      '    http-request redirect code 301 location https://example.com unless { hdr_end(host) -i example.com }',
      '    http-request redirect prefix https://%[req.hdr(Host)] drop-query if u_login !up_userid',
      '    http-request add-header scheme https if http u_login',
      '    http-request set-header prefix https://%[req.hdr(Host)] set-cookie SEEN=1 if !cookie_set'
    ];

    const parseObj = {
      'http-request': {
        'redirect': [
          [
            'code',
            '301',
            'location',
            'https://example.com',
            'unless',
            '{',
            'hdr_end(host)',
            '-i',
            'example.com',
            '}'
          ],
          [
            'prefix',
            'https://%[req.hdr(Host)]',
            'drop-query',
            'if',
            'u_login',
            '!up_userid'
          ]
        ],
        'add-header': [
          [
            'scheme',
            'https',
            'if',
            'http',
            'u_login'
          ]
        ],
        'set-header': [
          [
            'prefix',
            'https://%[req.hdr(Host)]',
            'set-cookie',
            'SEEN=1',
            'if',
            '!cookie_set'
          ],
            
        ]
      }
    };

    it('parse', () => {
      let parsed: HttpRequestResponseEntry = { 'http-request': {} };
      parseStrings.forEach((str: string) => {
        const errorfile = str.trim().split(' ');
        parsed = HttpRequestParser.parse(errorfile, parsed);
      });

      expect(parsed).toEqual(parseObj);
    });

    it('stringify', () => {
      expect(
        HttpRequestParser.stringify('', parseObj['http-request'])
      ).toEqual(parseStrings);
    });
  });
});
