import GlobalParser from '../../../haproxy/sections/global';

const rawCleanedSection = `global
maxconn 10
daemon
mode default`;

const parsedSection = {
  global: {
    maxconn: 10,
    daemon: true,
    mode: 'default'
  }
};

describe('Haproxy - sections - Global', () => {
  it('parse', () => {
    const lines = rawCleanedSection.split('\n');
    const global = new GlobalParser(lines);

    expect(global.data).toEqual(parsedSection);
  });
});
