import { HaproxyBackendEntry, HaproxyConfig, HaproxyCustomSectionsEnum, HaproxyFrontendEntry, HaproxyListenEntry } from '../typings';
import { HaproxyCustomSections, HaproxyMapSectionToCustom, HaproxySections, HaproxySectionsList } from '../const';
import DefaultsParser from './sections/defaults';
import GlobalParser from './sections/global';
import FrontendParser from './sections/frontend';
import BackendParser from './sections/backend';

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
      const sectionStart = sectionMapValues[i].start;
      const sectionEnd = sectionMapValues[i].end;
      const sectionRows = ConfigParser.getSectionRows(cleanedConfigArray, sectionStart, sectionEnd);
      const customSection = HaproxyMapSectionToCustom[sectionType];

      const Parser = this._selectSectionParser(customSection);

      if (Parser) {
        const parsedSection = new Parser(sectionRows).data;

        if ([
          HaproxySections.defaults,
          HaproxySections.global
        ].includes(sectionType)) {
          // console.log(sectionType);
          result = {
            ...result,
            ...parsedSection
          };

        } else if ([
          HaproxySections.frontend,
          HaproxySections.backend,
          HaproxySections.listen
        ].includes(sectionType)) {
          if (!result[customSection]) {
            result[customSection] = [];
          }

          result[customSection] = [
            ...result[customSection],
            parsedSection
          ];

        }
        
        // TODO add listeners, frontends, bakcends
      }
    }

    console.log(JSON.stringify(result));
    this.parsedConfig = result;
    return this.parsedConfig;
  }
  
  json(): string {
    return JSON.stringify(this.parsedConfig);
  }

  stringify(): Array<string> {
    let config: Array<string> = [];
    const content = this.parsedConfig;


    (Object.keys(content) as Array<HaproxyCustomSectionsEnum>).forEach((key: HaproxyCustomSectionsEnum) => {
      const Parser = this._selectSectionParser(key);

      if (Parser) {
        let stringifiedSection: any; // TODO any parser
        let stringifiedSectionContents: Array<string> = [];

        if (Array.isArray(content[key])) {
          (content[key] as Array<
            HaproxyFrontendEntry | HaproxyBackendEntry | HaproxyListenEntry
          >).forEach((entry) => {
            stringifiedSection = new Parser(entry);
            stringifiedSectionContents = [
              ...stringifiedSectionContents,
              ...stringifiedSection.contents,
              ''
            ];
          });
        } else {
          stringifiedSection = new Parser(content[key]);
          stringifiedSectionContents = [
            key,
            ...stringifiedSection.contents
          ];
        }

        config = [
          ...config,
          ...stringifiedSectionContents,
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

  _selectSectionParser(type: string) {
    const parsers = {
      [HaproxySections.global]: GlobalParser,
      [HaproxySections.defaults]: DefaultsParser,
      
      // Custom sections
      [HaproxyCustomSections.listeners]: undefined,
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