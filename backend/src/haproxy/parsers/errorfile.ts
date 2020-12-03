import { ErrorfileEntry, ErrorfileSubEntry, HaproxyAnySection } from '../../typings';
import Base from './base';

/**
 * Input:
 * 
 *  errorfile 400 /etc/haproxy/errors/400.http
 *  errorfile 403 /etc/haproxy/errors/403.http
 *  errorfile 408 /etc/haproxy/errors/408.http
 *  errorfile 500 /etc/haproxy/errors/500.http
 *  errorfile 502 /etc/haproxy/errors/502.http
 *  errorfile 503 /etc/haproxy/errors/503.http
 *  errorfile 504 /etc/haproxy/errors/504.http
 *
 * Output:
 * 
 *  {
 *    "errorfile": [
 *      400: "/etc/haproxy/errors/400.http",
 *      403: "/etc/haproxy/errors/403.http",
 *      408: "/etc/haproxy/errors/408.http",
 *      500: "/etc/haproxy/errors/500.http",
 *      502: "/etc/haproxy/errors/502.http",
 *      503: "/etc/haproxy/errors/503.http",
 *      504: "/etc/haproxy/errors/504.http"
 *    ]
 *  }
 *  
 */

export class Errorfile extends Base {
  static parse(arr: Array<string>, parsed?: ErrorfileEntry): ErrorfileEntry { // TODO change any
    const parsedErrorfiles = parsed?.errorfile 
      ? parsed.errorfile as ErrorfileSubEntry
      : {};

    const [, code, path] = arr;

    return {
      errorfile: {
        ...parsedErrorfiles,
        [code]: path
      }
    };
  }

  static stringify(_: string, entries: ErrorfileSubEntry): Array<string> {
    const results: Array<string> = [];
    const keys = Object.keys(entries);

    keys.forEach((key: string) => {
      results.push(`${Errorfile.indent()}errorfile ${key} ${entries[key]}`);
    });

    return results;
  }
}

export default Errorfile;
