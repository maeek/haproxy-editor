import ListParser from '../../haproxy/list-parser';

describe('Haproxy - ListParser', () => {
  const unparsed = `element1\nelement2\nelement3\nelement4\nelement5`;

  const parsedArray = [
    'element1',
    'element2',
    'element3',
    'element4',
    'element5'
  ];


  it('parse', () => {
    expect(ListParser.parse(unparsed)).toEqual(parsedArray);
  });

  it('toString', () => {
    expect(ListParser.toString(parsedArray)).toEqual(unparsed);
  });

});