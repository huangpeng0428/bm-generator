/* eslint no-param-reassign: ["error", { "props": false }] */
import Vue from 'vue'
import Enums from '../enums'
import router from '../router'

export default {
  getPermissionTree(state, res) {
    const value = res.value
    if (value === null) {
      router.replace('/401')
      return
    }
    const tree = []
    const urlMaps = Enums.urlMaps
    let defaultUrl = router.currentRoute.path
    let defaultNavCode = ''
    const navTabs = []

    if (defaultUrl === '/') {
      defaultUrl = ''
    }

    Object.keys(value).forEach((mod) => {
      if ('PAGE' in value[mod]) {
        value[mod].PAGE.forEach((m) => {
          const names = m.name.split('-')
          const url = m.resource in urlMaps ? urlMaps[m.resource] : m.resource
          const code = m.moduleName
          if (names.length === 2) {
            tree.push({
              title: names[names.length - 1],
              icon: '',
              code,
              url,
              children: [],
              name: m.name
            })
          } else {
            let index = tree.findIndex(p => p.title === names[names.length - 2])
            if (index === -1) {
              tree.push({
                title: names[names.length - 2],
                icon: '',
                code,
                children: [],
                name: m.name
              })
              index = tree.length - 1
            }
            tree[index].children.push({
              title: names[names.length - 1],
              url,
              icon: '',
              name: m.name
            })
          }
          if (!navTabs.some(p => p.code === code)) {
            navTabs.push({
              code,
              title: names[0],
              url
            })
          }
          if (!defaultUrl) {
            defaultUrl = url
          }

          if (defaultUrl === url ||
              (Enums.childPage[defaultUrl] && url === Enums.childPage[defaultUrl])) {
            defaultNavCode = m.moduleName
          }
        })
      }
    })

    // Object.keys(value).forEach((mod) => {
    //   if (mod in Enums.permissionTree) {
        // const info = {
        //   title: Enums.permissionTree[mod].title,
        //   icon: Enums.permissionTree[mod].icon,
        //   children: [],
        // }

    //     if ('PAGE' in value[mod]) {
    //       value[mod].PAGE.forEach((m) => {
    //         const names = m.name.split('-')
    //         const url = m.resource in urlMaps ? urlMaps[m.resource] : m.resource
    //         const code = m.moduleName
    //         if (names.length === 2) {
    //           tree.push({
    //             title: names[names.length - 1],
    //             url,
    //             icon: '',
    //             code,
    //             children: [],
    //           })
    //         } else {
    //           info.children.push({
    //             title: names[names.length - 1],
    //             url,
    //             icon: '',
    //           })
    //         }
    //         info.code = code
    //         if (!navTabs.some(p => p.code === code)) {
    //           navTabs.push({
    //             code,
    //             title: names[0],
    //             url,
    //           })
    //         }
    //         if (!defaultUrl) {
    //           defaultUrl = url
    //         }
    //         if (!defaultNavCode) {
    //           defaultNavCode = m.moduleName
    //         }
    //       })
    //       if (info.children.length) {
    //         tree.push(info)
    //       }
        // } else {
        //   console.warn(`${mod}缺少PAGE属性`, value[mod])
        // }
    //   } else {
    //     console.warn(`${mod}不在枚举当中`)
    //   }
    // })
    state.allPermissionTree = tree
    state.curNavCode = defaultNavCode
    state.navTabs = navTabs

    // 加载完成，触发 setDefaultUrl 事件
    Vue.Bus.$emit('setDefaultUrl', defaultUrl)
  },

  setNavCode(state, { code = '' }) {
    state.curNavCode = code
  },

  setPermissionTree(state) {
    state.permissionTree = state.allPermissionTree
  },

  getUserInfo(state, res) {
    state.userInfo = res
  },

  pushError(state, res) {
    state.errors.push(res)
  },

  removeError(state, index) {
    state.errors.splice(index, 1)
  },

  clearErrors(state) {
    state.errors = []
  }
}
