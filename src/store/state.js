import Enums from '../enums'
import Helper from '../helper'

export default {
  logo: 'DSP管理后台',
  permissionTree: [],
  allPermissionTree: [],
  navChildPage: Helper.assign({}, Enums.childPage),
  userInfo: {},
  errors: [],
  navTabs: [],
  curNavCode: '',
}
