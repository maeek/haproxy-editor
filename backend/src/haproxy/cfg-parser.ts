import { HaproxyConfig, HaproxyCustomSectionsEnum } from '../typings';
import { HaproxyCustomSections, HaproxySections, HaproxySectionsList } from '../const';
import DefaultsParser from './sections/defaults';
import GlobalParser from './sections/global';

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

      const Parser = this._selectSectionParser(sectionType);

      if (Parser) {
        const parsedSection = new Parser(sectionRows).data;

        if ([HaproxySections.defaults, HaproxySections.global].includes(sectionType)) {
          result = {
            ...result,
            ...parsedSection
          };
        }
        
        // TODO add listeners, frontends, bakcends
      }
    }

    this.parsedConfig = result;
    return this.parsedConfig;
  }
  
  json(): string {
    return JSON.stringify(this.parsedConfig);
  }

  stringify(sortOptions?: 'ASC' | 'DESC'): Array<string> {
    let config: Array<string> = [];

    (Object.keys(this.parsedConfig) as Array<HaproxyCustomSectionsEnum>).forEach((key: HaproxyCustomSectionsEnum) => {
      const Parser = this._selectSectionParser(key);

      if (Parser) {
        const stringifiedSection = new Parser(this.parsedConfig[key]);

        const isNamelessSection = [
          this._selectSectionParser(HaproxySections.global),
          this._selectSectionParser(HaproxySections.defaults)
        ]
        .map((ParserClass: any) => stringifiedSection instanceof ParserClass)
        .some((instance: boolean) => instance);

        const stringifiedSectionContents = stringifiedSection.contents || [];
        if (sortOptions) {
          stringifiedSectionContents.sort();
        }
        config = [
          ...config,
          isNamelessSection ? key : '',
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
      [HaproxySections.frontends]: undefined,
      [HaproxySections.listeners]: undefined,
      [HaproxySections.bakcends]: undefined,
      
      // Custom sections
      [HaproxyCustomSections.listeners]: undefined,
      [HaproxyCustomSections.frontends]: undefined,
      [HaproxyCustomSections.backends]: undefined,
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