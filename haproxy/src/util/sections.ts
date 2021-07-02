import { HaproxySectionsList } from '../const';

export type SectionsMap = {
  [key: string]: {
    section_key: string;
    line_start: number;
    line_end: number;
  }
}


export const findSectionIndexes = (configLines: string[]): SectionsMap => {
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
          section_key: lastSectionName.split(' ')[0],
          line_start: startIndex,
          line_end: endIndex
        };
      }

      startIndex = i;
      lastSectionName = configLines[i];
    }
  }

  return sectionMap;
};

export const findOptionIndex = (configLines: string[], sectionName: string, key: string): SectionsMap => {
  const { line_start, line_end } = findSectionIndexes(configLines)[sectionName];
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
      section_key: sectionName,
      line_start: start_index,
      line_end: end_index
    }
  };
};

export const getSectionRows = (arr: string[], start: number, end: number): string[] => {
  const result = [];

  for (let i = start; i < end; i++) {
    result.push(arr[i]);
  }

  return result;
};
