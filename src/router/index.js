/*
 * @Date: 2020-03-27 18:20:45
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-23 14:27:50
 */
import Vue from 'vue'
import Router from 'vue-router'
import Factory from '@/page/FactoryScreen';
import Generator from '@/page/GeneratorScreen';

Vue.use(Router)

export default new Router({
  routes: [
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
