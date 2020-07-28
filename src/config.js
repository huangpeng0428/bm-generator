/*
 * @Date: 2020-07-28 14:55:29
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-28 15:51:10
 */
import Vue from 'vue';
import Expose from './polo/bm-generator/lib/expose';
import request from './polo/bm-generator/lib/request';
import store from './store';

export default {
  init() {

    // expose.HOST = 'https://api-dashboard.flyme.cn'
    // expose.HOST = 'http://admin-mdsp.flyme.cn'
    // Expose.HOST = process.env.NODE_ENV != 'production' ? '' : 'http://admanage.meizu.com'
    Expose.HOST = 'http://admanage.meizu.com';
    request.interceptors.response.use(
      res => {
        if (res.data.code === 198001) {

          // 需要登录
          // location.href = `https://login.flyme.cn/login/login.html?useruri=${encodeURIComponent(location.href)}`
          location.href = 'http://admanage.meizu.com/uc/login';
        }
        if (res.status === 200 && res.data && res.data.code === 20001) {
          location.href = res.data.value;

          // 需要登录
          // location.href = `https://login.flyme.cn/login/login.html?useruri=${encodeURIComponent(location.href)}`
          return {
            code: 200,
            value: {
              data: [],
              total: 0
            }
          };
        }

        if (
          res.status === 200 &&
          typeof res.data === 'string' &&
          res.data.indexOf('权限') !== -1
        ) {
          store.commit('pushError', {
            type: 'auth',
            res
          });
        }
        return res.data;
      },
      res => {
        if (!res.url) {
          console.log('Request canceled', res.message);
        } else {

          // handle error
          store.commit('pushError', {
            type: 'response',
            res
          });
        }
      }
    );
    this.installComponents();
  },
  installComponents() {
    const requireComponent = require.context('./components', false, /\.vue$/);
    requireComponent.keys().forEach(fileName => {
      const componentConfig = requireComponent(fileName);
      const componentName = fileName.match(/([^/]+)\.vue$/)[1];
      Vue.component(
        componentName.replace(/^./, word => word.toUpperCase()),
        componentConfig.default || componentConfig
      );
    });
  }
};
