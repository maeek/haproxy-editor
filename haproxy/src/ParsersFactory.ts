/* eslint-disable @typescript-eslint/no-explicit-any */
import { HaproxySectionsList } from './const';
import { HaproxyConfig } from '../typings';
import { HaproxyOptions } from './const';
import Acl from './parsers/acl';
import { Bind } from './parsers/bind';
import Errofile from './parsers/errorfile';
import HttpRequest from './parsers/http-request';
import HttpResponse from './parsers/http-response';
import MultipleArgumentsParser from './parsers/multiple-arguments';
import NoArgument from './parsers/no-argument';
import NonUnique from './parsers/non-unique-keys';
// import NonUniqueArray from './parsers/non-unique-keys-array';
import Option from './parsers/option';
import SingleArgument from './parsers/single-arguments';
import Stats from './parsers/stats';
import Timeout from './parsers/timeout';
import SectionParserFactory from './SectionFactory';

export default class ParsersFactory {
  static parsers = {
    [HaproxyOptions.description]: SingleArgument,
    [HaproxyOptions.retries]: SingleArgument,
    [HaproxyOptions.mode]: SingleArgument,
    [HaproxyOptions.node]: SingleArgument,
    [HaproxyOptions.uid]: SingleArgument,
    [HaproxyOptions.gid]: SingleArgument,
    [HaproxyOptions.maxconn]: SingleArgument,
    [HaproxyOptions.maxpipes]: SingleArgument,
    [HaproxyOptions.chroot]: SingleArgument,
    [HaproxyOptions['log-format']]: SingleArgument,
  
    [HaproxyOptions.daemon]: NoArgument,
    [HaproxyOptions.debug]: NoArgument,
    [HaproxyOptions.quiet]: NoArgument,
  
    [HaproxyOptions.user]: NonUnique,
    [HaproxyOptions.log]: NonUnique,
    [HaproxyOptions.reqadd]: NonUnique,
    [HaproxyOptions.reqallow]: NonUnique,
    [HaproxyOptions.reqdel]: NonUnique,
    [HaproxyOptions.reqdeny]: NonUnique,
    [HaproxyOptions.reqiallow]: NonUnique,
    [HaproxyOptions.reqidel]: NonUnique,
    [HaproxyOptions.reqideny]: NonUnique,
    [HaproxyOptions.reqipass]: NonUnique,
    [HaproxyOptions.reqisetbe]: NonUnique,
    [HaproxyOptions.reqitarpit]: NonUnique,
    [HaproxyOptions.reqpass]: NonUnique,
    [HaproxyOptions.reqsetbe]: NonUnique,
    [HaproxyOptions.reqtarpit]: NonUnique,
    [HaproxyOptions.rspadd]: NonUnique,
    [HaproxyOptions.rspdel]: NonUnique,
    [HaproxyOptions.rspdeny]: NonUnique,
    [HaproxyOptions.rspidel]: NonUnique,
    [HaproxyOptions.rspideny]: NonUnique,
    
    // [HaproxyOptions.reqrep]: NonUnique,
    // [HaproxyOptions.reqirep]: NonUnique,
    // [HaproxyOptions.rspirep]: NonUnique,
    // [HaproxyOptions.rsprep]: NonUnique,
    
    [HaproxyOptions.server]: NonUnique,
    [HaproxyOptions.bind]: Bind,
    [HaproxyOptions.option]: Option,
    [HaproxyOptions.stats]: Stats,
    [HaproxyOptions.timeout]: Timeout,
    [HaproxyOptions.errorfile]: Errofile,
    [HaproxyOptions.acl]: Acl,
  
    [HaproxyOptions['http-request']]: HttpRequest,
    [HaproxyOptions['http-response']]: HttpResponse
  };

  static statsGroup = [
    HaproxyOptions['stats admin'],
    HaproxyOptions['stats auth'],
    HaproxyOptions['stats enable'],
    HaproxyOptions['stats hide-version'],
    HaproxyOptions['stats http-request'],
    HaproxyOptions['stats realm'],
    HaproxyOptions['stats refresh'],
    HaproxyOptions['stats scope'],
    HaproxyOptions['stats show-desc'],
    HaproxyOptions['stats show-legends'],
    HaproxyOptions['stats show-node'],
    HaproxyOptions['stats uri'],
  ];

  static optionsGroup = [
    HaproxyOptions.option,
    HaproxyOptions['option abortonclose'],
    HaproxyOptions['option accept-invalid-http-request'],
    HaproxyOptions['option accept-invalid-http-'],
    HaproxyOptions['option allbackups'],
    HaproxyOptions['option checkcache'],
    HaproxyOptions['option clitcpka'],
    HaproxyOptions['option contstats'],
    HaproxyOptions['option dontlog-normal'],
    HaproxyOptions['option dontlognull'],
    HaproxyOptions['option forceclose'],
    HaproxyOptions['option forwardfor'],
    HaproxyOptions['option http-no-delay'],
    HaproxyOptions['option http-keep-alive'],
    HaproxyOptions['option http-pretend-keepalive'],
    HaproxyOptions['option http-server-close'],
    HaproxyOptions['option http-use-proxy-header'],
    HaproxyOptions['option httpchk'],
    HaproxyOptions['option httpclose'],
    HaproxyOptions['option httplog'],
    HaproxyOptions['option http_proxy'],
    HaproxyOptions['option independant-streams'],
    HaproxyOptions['option ldap-check'],
    HaproxyOptions['option log-health-checks'],
    HaproxyOptions['option log-separate-errors'],
    HaproxyOptions['option logasap'],
    HaproxyOptions['option mysql-check'],
    HaproxyOptions['option nolinger'],
    HaproxyOptions['option originalto'],
    HaproxyOptions['option persist'],
    HaproxyOptions['option redispatch'],
    HaproxyOptions['option smtpchk'],
    HaproxyOptions['option socket-stats'],
    HaproxyOptions['option splice-auto'],
    HaproxyOptions['option splice-request'],
    HaproxyOptions['option splice-response'],
    HaproxyOptions['option srvtcpka'],
    HaproxyOptions['option ssl-hello-chk'],
    HaproxyOptions['option tcp-smart-accept'],
    HaproxyOptions['option tcp-smart-connect'],
    HaproxyOptions['option tcpka'],
    HaproxyOptions['option tcplog'],
    HaproxyOptions['option transparent']
  ];

  constructor(name: string) {
    // return new (ParsersFactory.getSectionParser(sectionName))(content);
    if (HaproxySectionsList.includes(name)) return SectionParserFactory.getSectionParser(name);

    return ParsersFactory.getParser(name);
  }

  static getParser(type: string): any {
    if (ParsersFactory.optionsGroup.includes(type)) return ParsersFactory.parsers.option;
    if (ParsersFactory.statsGroup.includes(type)) return ParsersFactory.parsers.stats;
    
    return ParsersFactory.parsers[type] || MultipleArgumentsParser;
  }
}
