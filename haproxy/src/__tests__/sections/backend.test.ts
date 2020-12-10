import BackendParser from '../../sections/backend';

const rawCleanedSection = `backend backend_default
mode http
server default 172.20.0.4:80
http-request set-header X-Forwarded-Port %[dst_port]
http-request add-header X-Forwarded-Proto https if { ssl_fc }
http-request deny if !{ src 10.10.0.0/16 } !{ src 10.20.0.0/16 } !{ src 172.20.0.0/16 }`;

const parsedSection = {
  backend_default: {
    mode: 'http',
    server: {
      'default': ['172.20.0.4:80']
    },
    'http-request': {
      'set-header': [
        [
          'X-Forwarded-Port',
          '%[dst_port]'
        ]
      ],
      'add-header': [
        [
          'X-Forwarded-Proto',
          'https',
          'if',
          '{',
          'ssl_fc',
          '}'
        ]
      ],
      deny: [
        [
          'if',
          '!{',
          'src',
          '10.10.0.0/16',
          '}',
          '!{',
          'src',
          '10.20.0.0/16',
          '}',
          '!{',
          'src',
          '172.20.0.0/16',
          '}'
        ]
      ],

    }
  }
};

describe('Haproxy - sections - Backend', () => {
  it('parse', () => {
    const lines = rawCleanedSection.split('\n');
    const backend = new BackendParser(lines);

    expect(backend.data).toEqual(parsedSection);
  });
});
