import {
  HaproxyConfig,
  HaproxyCustomSectionsEnum,
} from '../typings';
import {
  HaproxyCustomSections,
  HaproxyMapSectionToCustom,
  HaproxySections,
  HaproxySectionsList
} from '../const';
import DefaultsParser from './sections/defaults';
import GlobalParser from './sections/global';
import FrontendParser from './sections/frontend';
import BackendParser from './sections/backend';
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

  constructor(content: string) {
    this.content = content;
  }

  parse(): HaproxyConfig {
    let result: any = {}; // TODO
    const rawConfigArray = this.content.split('\n');
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

      const Parser = this.getSectionParser(customSection);

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
            result[customSection] = [];
          }

          const sectionName = Object.keys(parsedSection)[0];
          result[customSection] = {
            ...result[customSection],
            [sectionName]: parsedSection[sectionName]
          };
        }
      }
    }

    this.parsedConfig = result;
    return this.parsedConfig;
  }
  
  json(): string {
    return JSON.stringify(this.parsedConfig);
  }

  stringify(): Array<string> {
    let config: Array<string> = [];
    const content = this.parsedConfig;
    const sections = Object.keys(content) as Array<HaproxyCustomSectionsEnum>;

    sections.forEach((sectionName: HaproxyCustomSectionsEnum) => {
      const Parser = this.getSectionParser(sectionName);

      if (Parser) {
        let stringifiedSection: any = new Parser(content[sectionName]);
        let stringifiedSectionContents: Array<string> = [];

        const isNameless = ![
          HaproxyCustomSections.listeners,
          HaproxyCustomSections.frontends,
          HaproxyCustomSections.backends
        ].includes(sectionName);

        if (isNameless) {
          // Add global or defaults name
          stringifiedSectionContents = [sectionName];
        }

        config = [
          ...config,
          ...stringifiedSectionContents,
          ...stringifiedSection.contents,
          ''
        ];
      }
    });

    return config;
  }

  toString(): string {
    const stringified = this.stringify();

    this.content = stringified.join('\n')
    return this.content;
  }

  getSectionParser(type: string) {
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
      const isSection = HaproxySectionsList.some(section => line.startsWith(section));

      if (isSection || i === configLines.length - 1) {
        endIndex = i > 0 ? i : 0;
        
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