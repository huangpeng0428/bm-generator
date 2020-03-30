import Vue from 'vue'
import Router from 'vue-router'
import factoryScreen from '@/page/factoryScreen';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/factory/:code?',
      component: factoryScreen
    }
  ]
});
