import MapParser from '../../haproxy/map-parser';
import { parsedArray, parsedObj, unparsed } from '../mocks/map-parser.json';

describe('Haproxy - MapParser', () => {

  it('parse', () => {
    expect(MapParser.parse(unparsed)).toEqual(parsedArray);
  });

  it('parseToObj', () => {
    expect(MapParser.parseToObject(parsedArray)).toEqual(parsedObj);
  });

  it('parseFromObj', () => {
    expect(MapParser.parseFromObject(parsedObj)).toEqual(parsedArray);
  });

  it('toString', () => {
    expect(MapParser.toString(parsedArray)).toEqual(unparsed);
  });

  describe('validate', () => {
    it('validates - ok', () => {
      expect(MapParser.validate(parsedArray)).toBeTruthy();
    });

    it('validates - bad', () => {
      const testArray = [
        ['', ''],
        [''],
        ['', '']
      ];
      expect(MapParser.validate(testArray)).toBeFalsy();
    });
  });
});
