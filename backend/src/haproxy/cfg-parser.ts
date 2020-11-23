import {
  HaproxyCustomSections,
  HaproxyCustomSectionsList,
  HaproxyMapSectionToCustom,
  HaproxySections,
  HaproxySectionsList
} from '../const';
import {
  HaproxyBackend,
  HaproxyConfig,
  HaproxyCustomSectionsEnum,
  HaproxyFrontend,
  HaproxyListen,
  HaproxyUniqueSection
} from '../typings';
import BackendParser from './sections/backend';
import DefaultsParser from './sections/defaults';
import FrontendParser from './sections/frontend';
import GlobalParser from './sections/global';
import ListenerParser from './sections/listeners';

interface SectionsMap {
  [key: string]: {
    type: string;
    start: number;
    end: number;
  }
}

export default class ConfigParser {
  content: string;
  parsedConfig: HaproxyConfig = {};

  constructor(content: string | HaproxyConfig) {
    if (typeof content === 'string') {
      this.content = content;
      this.parsedConfig = this.parse();
    } else {
      this.parsedConfig = content;
      this.content = this.toString();
    }
  }

  parse(): HaproxyConfig {
    return ConfigParser.parse(this.content);
  }

  static parse(content: string): HaproxyConfig {
    let result: any = {}; // TODO
    const rawConfigArray = content.split('\n');
    const cleanedConfigArray = ConfigParser.cleanConfig(rawConfigArray);
    const configSectionsMap = ConfigParser.findSectionIndexes(cleanedConfigArray);

    const sectionMapKeys = Object.keys(configSectionsMap);
    const sectionMapValues = Object.values(configSectionsMap);

    for (let i = 0; i < sectionMapKeys.length; i++) {
      const sectionType = sectionMapValues[i].type as HaproxyCustomSectionsEnum;
      const sectionStart: number = sectionMapValues[i].start;
      const sectionEnd: number = sectionMapValues[i].end;
      const sectionRows = ConfigParser.getSectionRows(cleanedConfigArray, sectionStart, sectionEnd);
      const customSection = HaproxyMapSectionToCustom[sectionType];

      const Parser = ConfigParser.getSectionParser(customSection);

      if (Parser) {
        const parsedSection = new Parser(sectionRows).data;
        const isNamelessSection = [HaproxySections.defaults, HaproxySections.global].includes(sectionType);

        if (isNamelessSection) {
          result = {
            ...result,
            ...parsedSection
          };
        } else {
          if (!result[customSection]) {
            result[customSection] = {};
          }

          const sectionName = Object.keys(parsedSection)[0];
          result[customSection] = {
            ...result[customSection],
            [sectionName]: parsedSection[sectionName]
          };
        }
      }
    }

    return result;
  }
  
  json(): string {
    return JSON.stringify(this.parsedConfig);
  }

  stringify(): Array<string> {
    return ConfigParser.stringify(this.parsedConfig);
  }

  static stringify(content: any): Array<string> {
    if (!content) return [];

    let config: Array<string> = [];
    const sections = Object.keys(content) as Array<HaproxyCustomSectionsEnum>;

    sections.forEach((sectionName: HaproxyCustomSectionsEnum) => {
      const Parser = ConfigParser.getSectionParser(sectionName);

      if (Parser) {
        let stringifiedSection: any = new Parser({ [sectionName]: content[sectionName] });
        let stringifiedSectionContents: Array<string> = [];

        const isNameless = ![
          HaproxyCustomSections.listeners,
          HaproxyCustomSections.frontends,
          HaproxyCustomSections.backends
        ].includes(sectionName);

        if (isNameless) {
          stringifiedSectionContents = [
            ...stringifiedSection.contents,
            ''
          ];
        } else {
          Object.keys((
            content[sectionName] as HaproxyBackend | HaproxyFrontend | HaproxyListen
          )).forEach((entry: string) => {
            stringifiedSection = new Parser({
              [sectionName]: {
                [entry]: content[sectionName][entry]
              }
            });

            stringifiedSectionContents = [
              ...stringifiedSectionContents,
              ...stringifiedSection.contents,
              ''
            ];
          });
        }

        config = [
          ...config,
          ...stringifiedSectionContents
        ];
      }
    });

    return config;
  }

  toString(): string {
    return ConfigParser.toString(this.parsedConfig);
  }

  static toString(content: HaproxyConfig): string {
    const stringified = ConfigParser.stringify(content);

    return stringified.join('\n');
  }

  getSection(name: HaproxyCustomSectionsEnum): HaproxyConfig {
    if (!HaproxyCustomSectionsList.includes(name)) return {};

    return {
      [name]: this.parsedConfig[name] || {}
    };
  }

  getRawSection(name: HaproxyCustomSectionsEnum): string {
    const section = this.getSection(name);
    const Parser = ConfigParser.getSectionParser(name);
    const results = Parser.stringify(section).join('\n');

    return results;
  }

  getRawNamedSection(sectionName: HaproxyCustomSectionsEnum, name: string): string {
    const section = this.getNamedSection(sectionName, name);
    console.log(section);
    const Parser = ConfigParser.getSectionParser(sectionName);
    const results = Parser.stringify({ [name]: section }).join('\n');

    return results;
  }

  getNamedSection(baseSection: HaproxyCustomSectionsEnum, name: string): HaproxyConfig {
    if ([HaproxyCustomSections.global, HaproxyCustomSections.defaults].includes(baseSection)) {
      return this.getSection(baseSection);
    } else if([
      HaproxyCustomSections.backends, HaproxyCustomSections.frontends, HaproxyCustomSections.listeners
    ].includes(baseSection)) {
      const namedSection = (this.parsedConfig as HaproxyUniqueSection)[baseSection][name] || {}

      return {
        [name]: namedSection
      };
    }

    return {};
  }

  static getSectionParser(type: string) {
    const parsers = {
      [HaproxySections.global]: GlobalParser,
      [HaproxySections.defaults]: DefaultsParser,
      // Custom sections
      [HaproxyCustomSections.listeners]: ListenerParser,
      [HaproxyCustomSections.frontends]: FrontendParser,
      [HaproxyCustomSections.backends]: BackendParser
    };

    return parsers[type];
  }

  static getSectionRows(arr: Array<string>, start: number, end: number) {
    const result = [];

    for (let i = start; i < end; i++) {
      result.push(arr[i]);
    }

    return result;
  }

  static cleanConfig(contentArray: Array<string>) {
    const cleaned = [];

    for (let line of contentArray) {
      let cleanedLine = line.trim();
      cleanedLine = cleanedLine.replace(/\s+/g, ' ');

      if (cleanedLine.startsWith('#') || cleanedLine === '' ) {
        continue;
      }

      cleaned.push(cleanedLine);
    }

    return cleaned;
  }

  static findSectionIndexes(configLines: Array<string>): SectionsMap {
    const sectionMap: SectionsMap = {};
    let startIndex = 0, endIndex, lastSectionName;
    
    for (let i = 0; i < configLines.length; i++) {
      const line = configLines[i];
      const isSection = HaproxySectionsList.some((section: string) => line.startsWith(section));

      if (isSection || i === configLines.length - 1) {
        endIndex = i > 0 ? i : 0;

        if (i === configLines.length - 1) {
          endIndex = configLines.length;
        }
        
        if (lastSectionName) {
          sectionMap[lastSectionName] = {
            type: lastSectionName.split(' ')[0],
            start: startIndex,
            end: endIndex
          }
        }

        startIndex = i;
        lastSectionName = configLines[i];
      }
    }

    return sectionMap;
  }

}