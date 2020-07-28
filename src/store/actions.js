/*
 * @Date: 2020-07-23 14:57:09
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-28 16:40:17
 */
import request from '../polo/bm-generator/lib/request'
import router from '../router'

export default {
  getPermissionTree({ commit }) {
    request({
      url: 'console/mdsp/admin/permissions'
    })
    .then((res) => {
      commit('getPermissionTree', res)
      commit('setPermissionTree')
    })
  },

  getUserInfo({ commit }) {
    request.get('console/mdsp/admin/user/info')
      .then((res) => {
        commit('getUserInfo', res.value)
      })
  },

  setNavCode({ commit }, { code = '', url = '' }) {
    commit('setNavCode', { code })
    commit('setPermissionTree')

    // 更新路由
    router.push(url)
  }
}
