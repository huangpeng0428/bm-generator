/*
 * @Date: 2020-03-27 18:20:45
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-28 16:39:12
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import App from './App'
import router from './router'
import store from './store';
import config from './config';
import 'element-ui/lib/theme-chalk/index.css';
import './style/common.css';
import global from './polo/bm-generator/lib/global';

Vue.config.productionTip = false

config.init();
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
