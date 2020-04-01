/*
 * @Date: 2020-03-27 18:20:45
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-04-01 10:08:03
 */
import Vue from 'vue'
import Router from 'vue-router'
import Factory from '@/page/factoryScreen';

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'factory',
      path: '/factory/:code?',
      component: Factory
    }
  ]
});
