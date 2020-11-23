import ConfigParser from '../../haproxy/cfg-parser';
import { HaproxyConfig } from '../../typings';

import {unparsed, parsed} from '../mocks/cfg-parser.json';

describe('Haproxy - ConfigParser', () => {

  it('parse', () => {
    expect(ConfigParser.parse(unparsed)).toEqual(parsed);
  });

  it('stringify', () => {
    expect(
      ConfigParser.stringify(parsed).join('\n')
    ).toEqual(unparsed);
  });
});
