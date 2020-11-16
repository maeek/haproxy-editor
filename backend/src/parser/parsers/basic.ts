import { StandardEntry } from '../../typings';

export const basicParser = (arr: Array<string>): { [key: string]: StandardEntry } => {
  const [option, ...values] = arr;

  return {
    [option]: values
  }
}

export default basicParser;
