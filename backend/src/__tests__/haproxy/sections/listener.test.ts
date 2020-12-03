import ListenParser from '../../../haproxy/sections/listeners';
import { HaproxyListen, HaproxyUniqueSection } from '../../../typings';

const section = `listen stats
    bind 0.0.0.0:8998
    mode http
    stats auth Admin:password
    stats enable 
    stats realm Haproxy Statistics
    stats refresh 20s
    stats uri /admin?stats
`;

const rawCleanedSection = `listen stats
bind 0.0.0.0:8998
mode http
stats auth Admin:password
stats enable 
stats realm Haproxy Statistics
stats refresh 20s
stats uri /admin?stats`;

const parsedSection = {
  stats: {
    bind: {
      '0.0.0.0:8998': []
    },
    mode: 'http',
    'stats auth': {
      'user': 'Admin',
      'passwd': 'password'
    },
    'stats enable': true,
    'stats realm': 'Haproxy Statistics',
    'stats refresh': ['20s'],
    'stats uri': '/admin?stats'
  }
} as unknown as HaproxyUniqueSection<HaproxyListen>;

describe('Haproxy - sections - Listen', () => {
  it('parse', () => {
    const lines = rawCleanedSection.split('\n');
    const listen = new ListenParser(lines);

    expect(listen.data).toEqual(parsedSection);
  });

  it('stringify', () => {
    const listen = new ListenParser({
      listeners: {
        stats: parsedSection.stats as any
      }
    });

    expect(listen.contents).toEqual(section.split('\n'));
  });
});
