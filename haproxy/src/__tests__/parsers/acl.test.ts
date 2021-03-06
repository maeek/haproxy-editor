import AclParser from '../../parsers/acl';
import { AclEntry } from '../../../typings';

describe('Haproxy parsers - Acl', () => {
  const parseString = '    acl u_login path_beg /login';
  const parseArray = [
    'acl',
    'u_login',
    'path_beg',
    '/login'
  ];
  const parseObj: AclEntry = {
    acl: {
      'u_login': [
        'path_beg',
        '/login'
      ],
    }
  };

  it('parse', () => {
    expect(AclParser.parse(parseArray)).toEqual(parseObj);
  });

  it('stringify', () => {
    expect(
      AclParser.stringify('', parseObj.acl)[0]
    ).toEqual(parseString);
  });
});
