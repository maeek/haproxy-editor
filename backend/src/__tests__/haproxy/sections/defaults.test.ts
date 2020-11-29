import DefaultsParser from '../../../haproxy/sections/defaults';
import { HaproxyConfig } from '../../../typings';

const rawCleanedSection = `defaults
timeout connect 10s
timeout client 30s
timeout server 30s
errorfile 400 /etc/haproxy/errors-custom/400.http
errorfile 403 /etc/haproxy/errors-custom/403.http
errorfile 408 /etc/haproxy/errors-custom/408.http
errorfile 500 /etc/haproxy/errors-custom/500.http
errorfile 502 /etc/haproxy/errors-custom/502.http
errorfile 503 /etc/haproxy/errors-custom/503.http
errorfile 504 /etc/haproxy/errors-custom/504.http`;

const parsedSection = {
  defaults: {
    "timeout connect": "10s",
    "timeout client": "30s",
    "timeout server": "30s",
    errorfile: {
      400: "/etc/haproxy/errors-custom/400.http",
      403: "/etc/haproxy/errors-custom/403.http",
      408: "/etc/haproxy/errors-custom/408.http",
      500: "/etc/haproxy/errors-custom/500.http",
      502: "/etc/haproxy/errors-custom/502.http",
      503: "/etc/haproxy/errors-custom/503.http",
      504: "/etc/haproxy/errors-custom/504.http"
    }
  }
} as unknown as HaproxyConfig;

describe('Haproxy - sections - Default', () => {
  it('parse', () => {
    const lines = rawCleanedSection.split('\n');
    const defaults = new DefaultsParser(lines);

    expect(defaults.data).toEqual(parsedSection);
  });

  it('stringify', () => {
    const expected = rawCleanedSection.split('\n');

    const defaults = new DefaultsParser(parsedSection);

    const received = defaults.contents ? defaults.contents.map((str: string) => str.trim()) : [];

    expect(received).toEqual(expected);
  });
});
