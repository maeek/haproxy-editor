import {
  HaproxyCustomNonUniqueSectionsList, HaproxyCustomSectionsList, HaproxyCustomToSectionName
} from 'haproxy/build/const';

export default {
  cfg: {
    base: '/cfg',
    file: '/:config_file',
    section_base: '/:section',
    section: `/:section(${HaproxyCustomSectionsList.join('|')})`,
    named_section: `/:section(${HaproxyCustomNonUniqueSectionsList.join('|')})/:name`,
    option: `/:section(${HaproxyCustomSectionsList.join('|')})/:option`,
    option_in_named_section: `/:section(${HaproxyCustomNonUniqueSectionsList.join('|')})/:name/:option`
  }
};
