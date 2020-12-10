import BaseParser from '../../parsers/base';

describe('Haproxy parsers - Base', () => {
  it('indent', () => {
    expect(BaseParser.indent()).toEqual('    ');
  });
});
