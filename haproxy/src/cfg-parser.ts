/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HaproxyCustomNonUniqueSectionsList,
  HaproxyCustomSections, HaproxyCustomSectionsList, HaproxyMapSectionToCustom, HaproxySections
} from './const';
import {
  HaproxyAnySection, HaproxyConfig, HaproxyCustomSectionsEnum, HaproxyUniqueSection, HaproxyUniqueSections
} from '../typings';
import SectionParserFactory from './SectionFactory';
import { findSectionIndexes, getSectionRows } from './util/sections';
import cleanConfig from './util/clean';
import ParsersFactory from './ParsersFactory';

export default class ConfigParser {
  private content!: string;
  private parsedConfig: HaproxyConfig = {};

  constructor(content: string | HaproxyConfig) {
    if (typeof content === 'string') {
      this.raw = content;
    } else {
      this.config = content;
    }
  }

  get raw(): string {
    return this.content;
  }

  set raw(raw_config: string) {
    this.content = raw_config;
    this.parse();
  }

  get config(): HaproxyConfig {
    return this.parsedConfig;
  }

  set config(parsed_config: HaproxyConfig) {
    this.parsedConfig = parsed_config;
    this.toString();
  }

  parse(): HaproxyConfig {
    this.parsedConfig = ConfigParser.parse(this.raw);
    return this.parsedConfig;
  }

  static parse(content: string): HaproxyConfig {
    let result: HaproxyConfig = {};
    const rawConfigArray = content.split('\n');
    const cleanedConfigArray = cleanConfig(rawConfigArray);
    const configSectionsMap = findSectionIndexes(cleanedConfigArray);

    const sectionMapKeys = Object.keys(configSectionsMap);
    const sectionMapValues = Object.values(configSectionsMap);

    for (let i = 0; i < sectionMapKeys.length; i++) {
      const sectionType = sectionMapValues[i].section_key as HaproxyCustomSectionsEnum;
      const sectionStart: number = sectionMapValues[i].line_start;
      const sectionEnd: number = sectionMapValues[i].line_end;
      const sectionRows = getSectionRows(cleanedConfigArray, sectionStart, sectionEnd);
      const customSection = HaproxyMapSectionToCustom[sectionType] as HaproxyCustomSectionsEnum;

      // const Parser = SectionParserFactory.getSectionParser(customSection);
      const Parser = SectionParserFactory.getSectionParser(customSection);

      if (Parser) {
        const parsedSection = new Parser(sectionRows).config;
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
    return JSON.stringify(this.config);
  }

  stringify(): string[] {
    return ConfigParser.stringify(this.config);
  }

  static stringify(content: HaproxyConfig): string[] {
    if (!content) return [];

    let config: string[] = [];
    const sections = Object.keys(content) as HaproxyCustomSectionsEnum[];

    sections.forEach((sectionName: HaproxyCustomSectionsEnum) => {
      const Parser = SectionParserFactory.getSectionParser(sectionName);

      if (Parser) {
        let stringifiedSection: any = new Parser({ [sectionName]: content[sectionName] } as never);
        let stringifiedSectionContents: string[] = [];

        const isNameless = !HaproxyCustomNonUniqueSectionsList.includes(sectionName);

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
    this.raw = ConfigParser.toString(this.parsedConfig);
    return this.raw;
  }

  static toString(content: HaproxyConfig): string {
    const stringified = ConfigParser.stringify(content);

    return stringified.join('\n');
  }

  getSection(name: HaproxyCustomSectionsEnum): HaproxyConfig {
    if (!HaproxyCustomSectionsList.includes(name)) return {};

    return {
      [name]: this.config[name] || {}
    };
  }

  getRawSection(name: HaproxyCustomSectionsEnum): string {
    const section = this.getSection(name);
    const Parser = SectionParserFactory.getSectionParser(name);
    const results = Parser.stringify(section as any).join('\n');

    return results;
  }

  getRawNamedSection(sectionName: HaproxyCustomSectionsEnum, name: string): string {
    const section = this.getNamedSection(sectionName, name);
    const Parser = SectionParserFactory.getSectionParser(name);
    const results = Parser.stringify({ [name]: section } as any).join('\n');

    return results;
  }

  getNamedSection(baseSection: HaproxyCustomSectionsEnum, name: string): HaproxyConfig {
    if ([HaproxyCustomSections.global, HaproxyCustomSections.defaults].includes(baseSection)) {
      return this.getSection(baseSection);
    } else if(HaproxyCustomNonUniqueSectionsList.includes(baseSection)) {
      const namedSection = (this.config as HaproxyUniqueSection<HaproxyAnySection>)[baseSection][name] || {};

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
      [option]: (section as never)[namedSection || sectionName][option] || {}
    };
  }

  getRawOptionFromSection(sectionName: HaproxyCustomSectionsEnum, option: string, namedSection?: string): string {
    let section: HaproxyConfig;
    if (namedSection) {
      section = this.getNamedSection(sectionName, namedSection);
    } else {
      section = this.getSection(sectionName);
    }

    const result = ParsersFactory.getParser(option).stringify(option, (section as never)[namedSection || sectionName][option]);
    return Array.isArray(result) ? result.join('\n') : result;
  }

}
