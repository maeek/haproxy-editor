import {
  HttpRequestResponseSubEntry,
  HttpRequestResponseEntry,
  HttpRequestResponseMethods,
  HttpMethodEntry
} from '../../typings';
import Base from './base';

export class HttpResponse extends Base {
  static parse(arr: Array<string>, parsed?: any): HttpRequestResponseEntry { // TODO change any
    const parsedHttpRequests: HttpMethodEntry = parsed && parsed['http-response']
      ? parsed['http-response']
      : {};

    const [_, method, ...options] = arr;
    const httpRequestOptions: HttpRequestResponseSubEntry = options;

    const results: HttpRequestResponseEntry = {
      'http-response': {
        ...parsedHttpRequests
      },
    };
    
    if (results['http-response']) {
      if(!results['http-response'][method as HttpRequestResponseMethods]) {
        results['http-response'][method as HttpRequestResponseMethods] = [];
      }

      results['http-response'][method as HttpRequestResponseMethods]?.push(httpRequestOptions);
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
        results.push(`${HttpResponse.indent()}http-response ${key} ${val?.join(' ')}`);
      });
    });

    return results;
  }
};

export default HttpResponse;
