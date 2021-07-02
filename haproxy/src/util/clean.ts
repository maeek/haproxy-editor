export const cleanConfig = (contentArray: string[]): string[] => {
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
};

export const cleanList = (content: string[]): string[]  => {
  return content
    .map((str: string) => str.trim())
    .filter((str: string) => {
      if (str.startsWith('#') || str === '') return false;

      return str;
    });
};

export default cleanConfig;
