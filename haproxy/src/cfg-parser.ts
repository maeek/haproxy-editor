/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HaproxyCustomSections, HaproxyCustomSectionsList, HaproxyMapSectionToCustom, HaproxySections,
  HaproxySectionsList
} from './const';
import {
  HaproxyAnySection, HaproxyBackend, HaproxyConfig, HaproxyCustomSectionsEnum, HaproxyFrontend,
  HaproxyListen, HaproxyUniqueSection, HaproxyUniqueSections
} from '../typings';
import mapParser from './map-setting-to-parser';
import BackendParser from './sections/backend';
import DefaultsParser from './sections/defaults';
import FrontendParser from './sections/frontend';
import GlobalParser from './sections/global';
import ListenerParser from './sections/listeners';

export interface SectionsMap {
  [key: string]: {
    parent: string;
    line_start: number;
    line_end: number;
  }
}

export default class ConfigParser {
  content!: string;
  parsedConfig: HaproxyConfig = {};

  constructor(content: string | HaproxyConfig) {
    if (typeof content === 'string') {
      this.content = content;
      this.parse();
    } else {
      this.parsedConfig = content;
      this.toString();
    }
  }

  parse(): HaproxyConfig {
    this.parsedConfig = ConfigParser.parse(this.content);
    return this.parsedConfig;
  }

  static parse(content: string): HaproxyConfig {
    let result: HaproxyConfig = {};
    const rawConfigArray = content.split('\n');
    const cleanedConfigArray = ConfigParser.cleanConfig(rawConfigArray);
    const configSectionsMap = ConfigParser.findSectionIndexes(cleanedConfigArray);

    const sectionMapKeys = Object.keys(configSectionsMap);
    const sectionMapValues = Object.values(configSectionsMap);

    for (let i = 0; i < sectionMapKeys.length; i++) {
      const sectionType = sectionMapValues[i].parent as HaproxyCustomSectionsEnum;
      const sectionStart: number = sectionMapValues[i].line_start;
      const sectionEnd: number = sectionMapValues[i].line_end;
      const sectionRows = ConfigParser.getSectionRows(cleanedConfigArray, sectionStart, sectionEnd);
      const customSection = HaproxyMapSectionToCustom[sectionType] as HaproxyCustomSectionsEnum;

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
            result[customSection] = {} as HaproxyAnySection;
          }

          const sectionName = Object.keys(parsedSection)[0];
          result[customSection] = {
            ...result[customSection],
            [sectionName]: parsedSection[sectionName]
          } as HaproxyAnySection;
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

  static stringify(content: HaproxyConfig): Array<string> {
    if (!content) return [];

    let config: Array<string> = [];
    const sections = Object.keys(content) as Array<HaproxyCustomSectionsEnum>;

    sections.forEach((sectionName: HaproxyCustomSectionsEnum) => {
      const Parser = ConfigParser.getSectionParser(sectionName);

      if (Parser) {
        let stringifiedSection: any = new Parser({ [sectionName]: content[sectionName] } as never);
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
            content[sectionName] as HaproxyUniqueSections
          )).forEach((entry: string) => {
            stringifiedSection = new Parser({
              [sectionName]: {
                [entry]: (content[sectionName] as HaproxyAnySection)[entry]
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
    this.content = ConfigParser.toString(this.parsedConfig);
    return this.content;
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
    const results = Parser.stringify(section as any).join('\n');

    return results;
  }

  getRawNamedSection(sectionName: HaproxyCustomSectionsEnum, name: string): string {
    const section = this.getNamedSection(sectionName, name);
    const Parser = ConfigParser.getSectionParser(sectionName);
    const results = Parser.stringify({ [name]: section } as any).join('\n');

    return results;
  }

  getNamedSection(baseSection: HaproxyCustomSectionsEnum, name: string): HaproxyConfig {
    if ([HaproxyCustomSections.global, HaproxyCustomSections.defaults].includes(baseSection)) {
      return this.getSection(baseSection);
    } else if([HaproxyCustomSections.backends, HaproxyCustomSections.frontends, HaproxyCustomSections.listeners].includes(baseSection)) {
      const namedSection = (this.parsedConfig as HaproxyUniqueSection<HaproxyBackend | HaproxyFrontend | HaproxyListen>)[baseSection][name] || {};

      return {
        [name]: namedSection
      };
    }

    return {};
  }

  getOptionFromSection(sectionName: HaproxyCustomSectionsEnum, option: string, namedSection?: string): { [key: string]: string } {
    let section: HaproxyConfig;
    if (namedSection) {
      section = this.getNamedSection(sectionName, namedSection);
    } else {
      section = this.getSection(sectionName);
    }

    return {
      [option]: (section as any)[namedSection || sectionName][option] || {}
    };
  }

  getRawOptionFromSection(sectionName: HaproxyCustomSectionsEnum, option: string, namedSection?: string): string {
    let section: HaproxyConfig;
    if (namedSection) {
      section = this.getNamedSection(sectionName, namedSection);
    } else {
      section = this.getSection(sectionName);
    }

    const result = mapParser(option).stringify(option, (section as any)[namedSection || sectionName][option]);
    return Array.isArray(result) ? result.join('\n') : result;
  }

  static getSectionParser(type: string): any {
    const parsers = {
      [HaproxySections.global]: GlobalParser,
      [HaproxySections.defaults]: DefaultsParser,
      // Custom grouping sections
      [HaproxyCustomSections.listeners]: ListenerParser,
      [HaproxyCustomSections.frontends]: FrontendParser,
      [HaproxyCustomSections.backends]: BackendParser
    };

    return parsers[type];
  }

  static getSectionRows(arr: Array<string>, start: number, end: number): string[] {
    const result = [];

    for (let i = start; i < end; i++) {
      result.push(arr[i]);
    }

    return result;
  }

  static cleanConfig(contentArray: Array<string>): string[] {
    const cleaned = [];

    for (const line of contentArray) {
      let cleanedLine = line.trim();
      cleanedLine = cleanedLine
        .replace(/\s+/g, ' ')
        .replace('\\ ', ' ');

      if (cleanedLine.startsWith('#') || cleanedLine === '' ) {
        continue;
      }

      cleaned.push(cleanedLine);
    }

    return cleaned;
  }

  static findOptionIndex(configLines: Array<string>, sectionName: string, key: string): SectionsMap {
    const { line_start, line_end } = ConfigParser.findSectionIndexes(configLines)[sectionName];
    let start_index = -1;
    let end_index = -1;

    for (let i = line_start; i < line_end; i++) {
      if (configLines[i].trim().startsWith(key)) {
        if (start_index === -1) {
          start_index = i + 1;
        }
        end_index = i + 1;
      }
    }

    return {
      [key]: {
        parent: sectionName,
        line_start: start_index,
        line_end: end_index
      }
    };
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
            parent: lastSectionName.split(' ')[0],
            line_start: startIndex,
            line_end: endIndex
          };
        }

        startIndex = i;
        lastSectionName = configLines[i];
      }
    }

    return sectionMap;
  }

}
