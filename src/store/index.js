/*
 * @Date: 2020-07-23 14:57:09
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-27 10:14:14
 */
import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

// global state, getters, actions, mutations
import state from './state';
import getters from './getters';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  strict: debug,
  plugins: debug ? [createLogger()] : [],
  state,
  getters,
  actions,
  mutations,
});
