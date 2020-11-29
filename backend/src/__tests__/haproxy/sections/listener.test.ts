import BackendParser from '../../../haproxy/sections/backend';

const rawCleanedSection = `listen stats
bind *:1936
mode http
option forwardfor
option httpclose
stats enable
stats uri /
stats refresh 5s
stats show-legends
stats realm Haproxy\ Statistics`;

const parsedSection = {
  stats: {
    bind: ['*:1936'],
    mode: "http",
  }
};

// TODO

describe.skip('Haproxy - sections - Backend', () => {
  it('parse', () => {
    const lines = rawCleanedSection.split('\n');
    const global = new BackendParser(lines);

    // expect(global.data).toEqual(parsedSection);
    expect(1).toBeTruthy();
  });
});
