import { HaproxyConfig, HaproxySectionsEnum } from '../typings';
import { HaproxySections, HaproxySectionsList } from '../const';
import DefaultsParser from './defaults/parser';

interface SectionsMap {
  [key: string]: {
    type: string;
    start: number;
    end: number;
  }
}

export default class ConfigParser {
  content: string;
  parsedConfig?: HaproxyConfig;

  constructor(content: string) {
    this.content = content;
  }

  parse(): HaproxyConfig {
    let result: any = {}; // TODO
    const rawConfigArray = this.content.split('\n');
    const cleanedConfigArray = ConfigParser.cleanInputConfig(rawConfigArray);
    const configSectionsMap = ConfigParser.findSections(cleanedConfigArray);

    console.log(configSectionsMap);

    const sectionMapKeys = Object.keys(configSectionsMap);
    const sectionMapValues = Object.values(configSectionsMap);

    for (let i = 0; i < sectionMapKeys.length; i++) {
      const sectionType = sectionMapValues[i]['type'] as HaproxySectionsEnum;
      const sectionStart = sectionMapValues[i]['start'];
      const sectionEnd = sectionMapValues[i]['end'];
      const sectionRows = ConfigParser.getSectionRows(cleanedConfigArray, sectionStart, sectionEnd);

      const Parser = this._selectParser(sectionType);

      if (Parser) {
        const parsedSection = new Parser(sectionRows).data;
        if (!result[sectionType] && [HaproxySections.defaults, HaproxySections.global].includes(sectionType)) {
          result = {
            ...result,
            ...parsedSection
          };
        } // TODO add listeners, frontends, bakcends

        console.log(result);
      }
    }

    return result;
  }
  
  _selectParser(type: string) {
    switch (type) {
      case HaproxySections.global:
        return;
      case HaproxySections.defaults:
        return DefaultsParser;
      case HaproxySections.listen:
        return;
      case HaproxySections.frontend:
        return;
      case HaproxySections.backend:
        return;
      default:
        return;
    }
  }

  static getSectionRows(arr: Array<string>, start: number, end: number) {
    const result = [];

    for (let i = start; i < end; i++) {
      result.push(arr[i]);
    }

    return result;
  }

  static cleanInputConfig(contentArray: Array<string>) {
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

  static findSections(configLines: Array<string>): SectionsMap {
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