/*
 * @Date: 2020-03-27 18:20:45
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-28 15:49:47
 */
import Vue from 'vue'
import Router from 'vue-router'
import Factory from '../polo/bm-generator/lib/export/FactoryScreen.vue';
import Generator from '../polo/bm-generator/lib/export/GeneratorScreen.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'homepage',
      path: '/',

      // component: Generator,
      // redirect: '/generator/client_statistic',
      // 控制默认访问的 url
      beforeEnter(to, from, next) {
        Vue.Bus.$on('setDefaultUrl', url => {
          next(url);
        });
      }
    },
    {
      name: 'factory',
      path: '/factory/:code?',
      component: Factory
    },
    {
      name: 'generator',
      path: '/generator/:code/:id?',
      component: Generator
    }
  ]
});
