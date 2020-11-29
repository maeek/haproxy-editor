import {
  HaproxyAnySection,
  HttpMethodEntry, HttpRequestResponseEntry, HttpRequestResponseMethods,
  HttpRequestResponseSubEntry
} from '../../typings';
import NonUnique from './non-unique-keys';

/**
 * See http-request.ts for input and output examples
 */

export class HttpResponse extends NonUnique {
  static parse(arr: Array<string>, parsed?: HaproxyAnySection): HttpRequestResponseEntry { // TODO change any
    const parsedHttpRequests = parsed && parsed['http-response']
      ? parsed['http-response'] as HttpMethodEntry
      : {};

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [, method, ...options] = arr;
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
    
    // TODO implement http-request/http-response method (deny, redirect, ...) based parsing

    return results;
  }

  static stringify(_: string, entries: HttpMethodEntry): Array<string> {
    const results: Array<string> = [];

    const keys = Object.keys(entries);

    keys.forEach((key: string) => {
      const values = entries[key as HttpRequestResponseMethods];
      values?.forEach((val: string[]) => {
        results.push(`${HttpResponse.indent()}http-response ${key} ${val?.join(' ')}`);
      });
    });

    return results;
  }
}

export default HttpResponse;
