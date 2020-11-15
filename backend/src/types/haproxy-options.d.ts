export interface HaproxyOptionAcl {
  acl?: {
    aclname: string;
    criterion: string;
    flags?: '-i' | '-f' | '--';
    operator?: string;
    value: string | number;
  }
}

export interface HaproxyOptionAppsession {
  appsession?: {
    cookie: string;
    len: 'len';
    length: number;
    timeout: 'timeout';
    holdtime: number;
    'request-learn'?: string;
    prefix?: string;
    mode?: 'path-parameters' | 'query-string';
  }
}

export interface HaproxyOptionBacklog {
  backlog?: {
    conns: number;
  }
}

export type HaproxyLoadbalancerAlgorithms = 
  'roundrobin' |
  'leastconn' |
  'source' |
  'uri' |
  'url_param';
  

export interface HaproxyOptionBalance {
  balance?: {
    algorithm: number;
  }
}
