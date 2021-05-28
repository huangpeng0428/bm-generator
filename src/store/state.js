/*
 * @Date: 2020-07-23 14:57:09
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-27 10:15:07
 */
import Enums from '../enums';
import Helper from '../helper';

export default {
  logo: 'DSP管理后台',
  permissionTree: [],
  allPermissionTree: [],
  navChildPage: Helper.assign({}, Enums.childPage),
  userInfo: {},
  errors: [],
  navTabs: [],
  curNavCode: '',
};
