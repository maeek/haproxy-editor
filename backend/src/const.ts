export const HaproxySections: { [key: string]: string } = {
  global: 'global',
  defaults: 'defaults',
  listen: 'listen',
  frontend: 'frontend',
  backend: 'backend'
};

export const HaproxySectionsList: Array<string> = Object.values(HaproxySections);

export const HaproxyCustomSections: { [key: string]: string } = {
  global: 'global',
  defaults: 'defaults',
  listeners: 'listeners',
  frontends: 'frontends',
  backends: 'backends'
};

export const HaproxyCustomSectionsList: Array<string> = Object.values(HaproxyCustomSections);

export const HaproxyMapSectionToCustom: { [key: string]: string } = {
  [HaproxySections.global]: HaproxyCustomSections.global,
  [HaproxySections.defaults]: HaproxyCustomSections.defaults,
  [HaproxySections.listen]: HaproxyCustomSections.listeners,
  [HaproxySections.frontend]: HaproxyCustomSections.frontends,
  [HaproxySections.backend]: HaproxyCustomSections.backends
};

export const HaproxyOptions: { [key: string]: string } = {
  acl: 'acl',
  appsession: 'appsession',
  backlog: 'backlog',
  balance: 'balance',
  bind: 'bind',
  'bind-process': 'bind-process',
  block: 'block',
  capture: 'capture',
  clitimeout: 'clitimeout',
  contimeout: 'contimeout',
  cookie: 'cookie',
  'default-server': 'default-server',
  default_backend: 'default_backend',
  description: 'description',
  disabled: 'disabled',
  dispatch: 'dispatch',
  enabled: 'enabled',
  errorfile: 'errorfile',
  errorloc: 'errorloc',
  errorloc302: 'errorloc302',
  errorloc303: 'errorloc303',
  'force-persist': 'force-persist',
  fullconn: 'fullconn',
  grace: 'grace',
  'hash-type': 'hash-type',
  'http-check': 'http-check',
  'http-request': 'http-request',
  id: 'id',
  'ignore-persist': 'ignore-persist',
  log: 'log',
  maxconn: 'maxconn',
  mode: 'mode',
  monitor: 'monitor',
  'monitor-net': 'monitor-net',
  'monitor-uri': 'monitor-uri',
  option: 'option',
  persist: 'persist',
  'rate-limit': 'rate-limit',
  redirect: 'redirect',
  redisp: 'redisp',
  redispatch: 'redispatch',
  reqadd: 'reqadd',
  reqallow: 'reqallow',
  reqdel: 'reqdel',
  reqdeny: 'reqdeny',
  reqiallow: 'reqiallow',
  reqidel: 'reqidel',
  reqideny: 'reqideny',
  reqipass: 'reqipass',
  reqirep: 'reqirep',
  reqisetbe: 'reqisetbe',
  reqitarpit: 'reqitarpit',
  reqpass: 'reqpass',
  reqrep: 'reqrep',
  reqsetbe: 'reqsetbe',
  reqtarpit: 'reqtarpit',
  retries: 'retries',
  rspadd: 'rspadd',
  rspdel: 'rspdel',
  rspdeny: 'rspdeny',
  rspidel: 'rspidel',
  rspideny: 'rspideny',
  rspirep: 'rspirep',
  rsprep: 'rsprep',
  server: 'server',
  source: 'source',
  srvtimeout: 'srvtimeout',
  stats: 'stats',
  stick: 'stick',
  'stick-table': 'stick-table',
  'tcp-request': 'tcp-request',
  timeout: 'timeout',
  transparent: 'transparent',
  use_backend: 'use_backend'
};


export const HaproxyOptionsList: Array<string> = Object.values(HaproxyOptions);

export const HaproxyParsers: { [key: string]: string } = {
  acl: 'acl',
  daemon: 'daemon',
  capture: 'capture',
  description: 'description',
  errorfile: 'errorfile',
  'http-check': 'http-check',
  'http-request': 'http-request',
  'http-response': 'http-response',
  monitor: 'monitor',
  option: 'option',
  persist: 'persist',
  stats: 'stats',
  stick: 'stick',
  timeout: 'timeout',
  mode: 'mode'
};

export const HaproxyParsersList: Array<string> = Object.values(HaproxyParsers);
