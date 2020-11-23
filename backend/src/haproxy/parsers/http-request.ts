import {
  HttpMethodEntry,
  HttpRequestResponseEntry,
  HttpRequestResponseMethods,
  HttpRequestResponseSubEntry
} from '../../typings';
import Base from './base';

export class HttpRequest extends Base {
  static parse(arr: Array<string>, parsed?: any): HttpRequestResponseEntry { // TODO change any
    const parsedHttpRequests: HttpMethodEntry = parsed && parsed['http-request']
      ? parsed['http-request']
      : {};

    const [_, method, ...options] = arr;
    const httpRequestOptions: HttpRequestResponseSubEntry = options;

    const results: HttpRequestResponseEntry = {
      'http-request': {
        ...parsedHttpRequests
      },
    };
    
    if (results['http-request']) {
      if(!results['http-request'][method as HttpRequestResponseMethods]) {
        results['http-request'][method as HttpRequestResponseMethods] = [];
      }

      results['http-request'][method as HttpRequestResponseMethods]?.push(httpRequestOptions);
    }
    
    // TODO implement method based parsing

    return results;
  }

  static stringify(_: string, entries: HttpMethodEntry): Array<string> {
    let results: Array<string> = [];

    const keys = Object.keys(entries);

    keys.forEach((key: string) => {
      const values = entries[key as HttpRequestResponseMethods];
      values?.forEach((val: string[]) => {
        results.push(`${HttpRequest.indent()}http-request ${key} ${val?.join(' ')}`);
      });
    });

    return results;
  }
};

export default HttpRequest;
