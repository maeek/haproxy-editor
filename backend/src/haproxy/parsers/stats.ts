/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entry, StandardEntry } from '../../typings';
import SingleArgument from './single-arguments';

/**
 * Input:
 * 
 *  stats auth Admin:password
 *  stats enable 
 *  stats realm Haproxy Statistics
 *  stats refresh 20s
 *  stats uri /admin?stats
 * 
 * Output:
 * 
 *  {
 *    "stats auth": {
 *      "user": "Admin",
 *      "passwd": "password"
 *    },
 *    "stats enable": true,
 *    "stats realm": "Haproxy Statistics",
 *    "stats refresh": [
 *      "20s"
 *    ],
 *    "stats uri": "/admin?stats"
 *  }
 * 
 */

export class Stats extends SingleArgument {
  static customPayload: string[] = [
    'enable',
    'auth',
    'realm',
    'uri'
  ];

  static parse(arr: Array<string>): Entry {
    const [name, type, ...rest] = arr;

    const payload = Stats.customPayload.includes(type) ? Stats.getCustomPayload(type, rest) : rest;

    return {
      [`${name} ${type}`]: payload
    };
  }

  static stringify(key: string, entry?: StandardEntry): string {
    const value = entry ? Stats.stringifyPayload(entry) : '';
    console.log(entry);
    return `${SingleArgument.indent()}${key} ${value}`;
  }

  static stringifyPayload(entry: any): string {
    if (typeof entry === 'boolean') {
      return '';
    }
    else if (typeof entry === 'string') {
      return entry;
    }
    else if (entry?.user && entry?.passwd) {
      return `${entry.user}:${entry.passwd}`;
    } 
    return entry.join(' ');
    
  }

  static getCustomPayload(type: string, payload: string[]): string[] | boolean | string {
    const parser: { [key: string]: any } = {
      enable: true,
      auth: {
        user: payload[0] ? payload[0].split(':')[0] : '',
        passwd: payload[0] ? payload[0].split(':')[1] : ''
      },
      realm: payload.join(' ').replace('\\', ''),
      uri: payload.join(' ')
    };

    return parser[type] || payload;
  }
}

export default Stats;
