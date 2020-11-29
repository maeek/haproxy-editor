import ConfigParser from '../../haproxy/cfg-parser';
import { HaproxyConfig } from '../../typings';
import { parsed, unparsed } from '../mocks/cfg-parser.json';

describe('Haproxy - ConfigParser', () => {

  it('parse', () => {
    expect(ConfigParser.parse(unparsed)).toEqual(parsed);
  });

  it('stringify', () => {
    const toParse = parsed as unknown;
    expect(
      ConfigParser.stringify(toParse as HaproxyConfig).join('\n')
    ).toEqual(unparsed);
  });
});
