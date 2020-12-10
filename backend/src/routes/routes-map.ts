import {
  HaproxyCustomNonUniqueSectionsList, HaproxyCustomSectionsList
} from 'haproxy/build/const';

export const routes = {
  cfg: {
    base: '/cfg',
    file: '/:config_file',
    section_base: '/:section',
    section: `/:section(${HaproxyCustomSectionsList.join('|')})`,
    named_section: `/:section(${HaproxyCustomNonUniqueSectionsList.join('|')})/:name`,
    option: `/:section(${HaproxyCustomSectionsList.join('|')})/:option`,
    option_in_named_section: `/:section(${HaproxyCustomNonUniqueSectionsList.join('|')})/:name/:option`
  },
  map: {
    base: '/map',
    file: '/:map_file'
  }
};

export default routes;
