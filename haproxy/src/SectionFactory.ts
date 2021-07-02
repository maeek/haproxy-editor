/* eslint-disable @typescript-eslint/no-explicit-any */
import { HaproxyCustomSections, HaproxySections } from './const';
import { HaproxyConfig } from '../typings';
import BackendParser from './sections/backend';
import DefaultsParser from './sections/defaults';
import FrontendParser from './sections/frontend';
import GlobalParser from './sections/global';
import ListenerParser from './sections/listeners';
import ResolversParser from './sections/resolvers';
import MailersParser from './sections/mailers';
import PeersParser from './sections/peers';
import UserlistParser from './sections/userlist';

export interface Parsers {
  config: HaproxyConfig;
  rawConfig: string;
  parse(content: string): HaproxyConfig;
  stringify(content: HaproxyConfig): string[];
}

export default class SectionParserFactory {

  constructor(sectionName: string) {
    return SectionParserFactory.getSectionParser(sectionName) as Parsers;
  }

  static getSectionParser(type: string): any { // TODO: convert to factory
    const parsers = {
      [HaproxySections.global]: GlobalParser,
      [HaproxySections.defaults]: DefaultsParser,
      // Custom grouping sections
      [HaproxyCustomSections.listeners]: ListenerParser,
      [HaproxyCustomSections.frontends]: FrontendParser,
      [HaproxyCustomSections.backends]: BackendParser,
      [HaproxyCustomSections.resolvers]: ResolversParser,
      [HaproxyCustomSections.mailers]: MailersParser,
      [HaproxyCustomSections.peers]: PeersParser,
      [HaproxyCustomSections.userlist]: UserlistParser,
    };

    return parsers[type];
  }

}
