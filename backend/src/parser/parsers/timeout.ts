import { StandardEntry } from '../../typings';

export const timeoutParser = (arr: Array<string>): {[key: string]: StandardEntry} => {
  const [name, type, timeout] = arr;

  return {
    [`${name} ${type}`]: timeout
  };
}

export default timeoutParser;
