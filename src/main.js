/*
 * @Date: 2020-03-27 18:20:45
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-23 16:06:02
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import App from './App'
import router from './router'
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import http from './lib/http';
import global from './lib/global';

Vue.config.productionTip = false

Vue.prototype.$http = http

Vue.use(ElementUI);
Vue.use(global.installPlugins());
global.installComponents();
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
