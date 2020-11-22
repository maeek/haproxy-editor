import BaseParser from '../../../haproxy/parsers/base';

describe('Haproxy parsers - Base', () => {
  it('indent', () => {
    expect(BaseParser.indent()).toEqual('    ');
  });
});
