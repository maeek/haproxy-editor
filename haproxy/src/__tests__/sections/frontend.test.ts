import FrontendParser from '../../sections/frontend';

const section = `frontend example
    bind *:80
    bind *:443 ssl crt /certs/pem/
    mode http
    redirect scheme https if !{ ssl_fc }
    use_backend %[req.hdr(Host),lower,map_dom(/usr/local/etc/haproxy/dom2back.map,backend_default)]
    http-request redirect code 301 location https://%[hdr(host)].example.com%[capture.req.uri] unless { hdr_end(host) -i example.com }
`;


const rawCleanedSection = `frontend example
bind *:80
bind *:443 ssl crt /certs/pem/
mode http
redirect scheme https if !{ ssl_fc }
use_backend %[req.hdr(Host),lower,map_dom(/usr/local/etc/haproxy/dom2back.map,backend_default)]
http-request redirect code 301 location https://%[hdr(host)].example.com%[capture.req.uri] unless { hdr_end(host) -i example.com }`;

const parsedSection = {
  example: {
    bind: {
      '*:80': [],
      '*:443': [
        'ssl',
        'crt',
        '/certs/pem/'
      ]
    },
    mode: 'http',
    redirect: [
      'scheme',
      'https',
      'if',
      '!{',
      'ssl_fc',
      '}'
    ],
    use_backend: ['%[req.hdr(Host),lower,map_dom(/usr/local/etc/haproxy/dom2back.map,backend_default)]'],
    'http-request': {
      'redirect': [
        [
          'code',
          '301',
          'location',
          'https://%[hdr(host)].example.com%[capture.req.uri]',
          'unless',
          '{',
          'hdr_end(host)',
          '-i',
          'example.com',
          '}'
        ],
      ]
    }
  }
};

describe('Haproxy - sections - Frontend', () => {
  it('parse', () => {
    const lines = rawCleanedSection.split('\n');
    const frontend = new FrontendParser(lines);

    expect(frontend.data).toEqual(parsedSection);
  });

  it('stringify', () => {
    const front = new FrontendParser({
      frontends: {
        example: parsedSection.example as any
      }
    });

    expect(front.contents).toEqual(section.split('\n'));
  });
});
