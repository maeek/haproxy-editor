export type HaproxyKeys = 'global' | 'defaults' | 'frontend' | 'listen' | 'backend';

export enum HaproxySectionsEnum {
  global = 'global',
  defaults = 'defaults',
  frontends = 'frontends',
  listeners = 'listeners',
  backends = 'backends'
}

export type ManagementAndSecurity = 
  'chroot' |
  'daemon' |
  'gid' |
  'group' |
  'log' |
  'log-send-hostname' |
  'nbproc' |
  'pidfile' |
  'uid' |
  'ulimit-n' |
  'user' |
  'stats' |
  'node' |
  'description';

export type PerformanceTunning =
  'maxconn' |
  'maxpipes' |
  'noepoll' |
  'nokqueue' |
  'nopoll' |
  'nosepoll' |
  'nosplice' |
  'spread-checks' |
  'tune.bufsize' |
  'tune.chksize' |
  'tune.maxaccept' |
  'tune.maxpollevents' |
  'tune.maxrewrite' |
  'tune.rcvbuf.client' |
  'tune.rcvbuf.server' |
  'tune.sndbuf.client' |
  'tune.sndbuf.server';

export type Debugging = 'debug' | 'quiet';

export type GlobalFields = ManagementAndSecurity | PerformanceTunning | Debugging;

export type DefaultsFields = 
  'backlog' |
  'balance' |
  'bind-process' |
  'cookie' |
  'default-server' |
  'default_backend' |
  'disabled' |
  'enabled' |
  // 'errorfile' |
  'errorloc' |
  'errorloc302' |
  'errorloc303' |
  'fillconn' |
  'grace' |
  'hash-type' |
  'http-check' |
  'log' |
  'maxconn' |
  'mode' |
  'monitor-net' |
  'monitor-uri' |
  'mode' |
  'option' |
  'persist' |
  'rate-limit' |
  'redisp' |
  'redispatch' |
  'retries' |
  'source' |
  'srvtimeout' |
  'stats' |
  'timeout check' |
  'timeout client' |
  'timeout clitimeout' |
  'timeout connect' |
  'timeout contimeout' |
  'timeout http-keep-alive' |
  'timeout http-request' |
  'timeout queue' |
  'timeout server' |
  'timeout srvtimeout' |
  'timeout tarpit' |
  'transparent';

export type FrontendFields = 
  'acl' |
  'backlog' |
  'bind' |
  'bind-process' |
  'block' |
  'capture' |
  'clitimeout' |
  'default_backend' |
  'description' |
  'disabled' |
  'enabled' |
  'errorfile' |
  'errorloc' |
  'errorloc302' |
  'errorloc303' |
  'force-persist' |
  'grace' |
  'http-request' |
  'id' |
  'ignore-persist' |
  'log' |
  'maxconn' |
  'mode' |
  'monitor' |
  'option' |
  'rate-limit' |
  'redirect' |
  'reqadd' |
  'reqallow' |
  'reqdel' |
  'reqdeny' |
  'reqiallow' |
  'reqidel' |
  'reqideny' |
  'reqipass' |
  'reqirep' |
  'reqisetbe' |
  'reqitarpit' |
  'reqpass' |
  'reqrep' |
  'reqsetbe' |
  'reqtarpit' |
  'rspadd' |
  'rspdel' |
  'rspdeny' |
  'rspidel' |
  'rspideny' |
  'rspirep' |
  'rsprep' |
  'tcp-request' |
  'timeout' |
  'use_backend';

export type AllFields = 
  'acl' |
  'appsession' |
  'backlog' |
  'balance' |
  'bind' |
  'bind-process' |
  'block' |
  'capture' |
  'clitimeout' |
  'contimeout' |
  'cookie' |
  'default-server' |
  'default_backend' |
  'description' |
  'disabled' |
  'dispatch' |
  'enabled' |
  'errorfile' |
  'errorloc' |
  'errorloc302' |
  'errorloc303' |
  'force-persist' |
  'fullconn' |
  'grace' |
  'hash-type' |
  'http-check' |
  'http-request' |
  'id' |
  'ignore-persist' |
  'log' |
  'maxconn' |
  'mode' |
  'monitor' |
  'monitor-net' |
  'monitor-uri' |
  'option' |
  'persist' |
  'rate-limit' |
  'redirect' |
  'redisp' |
  'redispatch' |
  'reqadd' |
  'reqallow' |
  'reqdel' |
  'reqdeny' |
  'reqiallow' |
  'reqidel' |
  'reqideny' |
  'reqipass' |
  'reqirep' |
  'reqisetbe' |
  'reqitarpit' |
  'reqpass' |
  'reqrep' |
  'reqsetbe' |
  'reqtarpit' |
  'retries' |
  'rspadd' |
  'rspdel' |
  'rspdeny' |
  'rspidel' |
  'rspideny' |
  'rspirep' |
  'rsprep' |
  'server' |
  'source' |
  'srvtimeout' |
  'stats' |
  'stick' |
  'stick-table' |
  'tcp-request' |
  'timeout' |
  'transparent' |
  'use_backend';

export type BackendFields = 
  'acl' |
  'appsession' |
  'balance' |
  'bind-process' |
  'block' |
  'contimeout' |
  'cookie' |
  'default-server' |
  'description' |
  'disabled' |
  'dispatch' |
  'enabled' |
  'errorfile' |
  'errorloc' |
  'errorloc302' |
  'errorloc303' |
  'force-persist' |
  'fullconn' |
  'grace' |
  'hash-type' |
  'http-check' |
  'http-request' |
  'id' |
  'ignore-persist' |
  'log' |
  'mode' |
  'option' |
  'persist' |
  'redirect' |
  'redisp' |
  'redispatch' |
  'reqadd' |
  'reqallow' |
  'reqdel' |
  'reqdeny' |
  'reqiallow' |
  'reqidel' |
  'reqideny' |
  'reqipass' |
  'reqirep' |
  'reqisetbe' |
  'reqitarpit' |
  'reqpass' |
  'reqrep' |
  'reqsetbe' |
  'reqtarpit' |
  'retries' |
  'rspadd' |
  'rspdel' |
  'rspdeny' |
  'rspidel' |
  'rspideny' |
  'rspirep' |
  'rsprep' |
  'server' |
  'source' |
  'srvtimeout' |
  'stats' |
  'stick' |
  'stick-table' |
  'timeout' |
  'transparent';

export interface ErrorfileEntry {
  code?: number;
  path?: string;
}

export type ErrorfileEntryList = Array<ErrorfileEntry>;

export interface ErrorfileEntryGroup {
  errorfile: ErrorfileEntryList;
}

export type StandardEntry = string | Array<string | number>;

export interface HaproxyGlobal {
  [HaproxySectionsEnum.global]?: {
    [key in GlobalFields | 'name']?: StandardEntry
  }
}

export interface HaproxyDefaults {
  [HaproxySectionsEnum.defaults]?: {
    [key in DefaultsFields | 'name']?: StandardEntry;
  } & {
    errorfile?: ErrorfileEntryList;
  }
}

export interface HaproxyFrontend {
  [HaproxySectionsEnum.frontends]?: Array<{
    [key in FrontendFields | 'name']?: StandardEntry
  }>
}

export interface HaproxyListen {
  [HaproxySectionsEnum.listeners]?: Array<{
    [key in AllFields | 'name']?: StandardEntry
  }>
}


export interface HaproxyBackend {
  [HaproxySectionsEnum.backends]?: Array<{
    [key in BackendFields | 'name']?: StandardEntry
  }>
}

export interface HaproxyConfig {
  global?: HaproxyGlobal;
  defaults?: HaproxyDefaults;
  frontends?: HaproxyFrontend;
  listeners?: HaproxyListen;
  backends?: HaproxyBackend;
}
