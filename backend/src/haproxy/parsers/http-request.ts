import {
  HaproxyAnySection,
  HttpMethodEntry, HttpRequestResponseEntry, HttpRequestResponseMethods,
  HttpRequestResponseSubEntry
} from '../../typings';
import NonUnique from './non-unique-keys';

/**
 * Input:
 * 
 *  http-request deny if !{ src 10.10.0.0/16 } !{ src 10.20.0.0/16 } !{ src 172.20.0.0/16 }
 *  http-request redirect code 301 location https://%[hdr(host)].internal.example.com%[capture.req.uri] unless { hdr_end(host) -i example.com }
 * 
 * Output:
 * 
 *   {
 *     "http-request": {
 *       "deny": [
 *          [
 *            "if",
 *            "!{",
 *            "src",
 *            "10.10.0.0/16",
 *            "}",
 *            "!{",
 *            "src",
 *            "10.20.0.0/16",
 *            "}",
 *            "!{",
 *            "src",
 *            "172.20.0.0/16",
 *            "}"
 *          ]
 *       ]
 *       "redirect": [
 *          [
 *            "code",
 *            "301",
 *            "location",
 *            "https://%[hdr(host)].internal.example.com%[capture.req.uri]",
 *            "unless",
 *            "{",
 *            "hdr_end(host)",
 *            "-i",
 *            "example.com",
 *            "}"
 *          ]
 *       ]
 *     }
 *   }
 * 
 */

export class HttpRequest extends NonUnique {
  static parse(arr: Array<string>, parsed?: HaproxyAnySection): HttpRequestResponseEntry { // TODO change any
    const parsedHttpRequests = parsed && parsed['http-request']
      ? parsed['http-request'] as HttpMethodEntry
      : {};

    const [, method, ...options] = arr;
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
    const results: Array<string> = [];

    const keys = Object.keys(entries);

    keys.forEach((key: string) => {
      const values = entries[key as HttpRequestResponseMethods];
      values?.forEach((val: string[]) => {
        results.push(`${HttpRequest.indent()}http-request ${key} ${val?.join(' ')}`);
      });
    });

    return results;
  }
}

export default HttpRequest;
