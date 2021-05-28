import Bus from '@flyme/bm-generator/lib/bus';

export default {
  /* eslint-disable */
  install(Vue, options) {
    Vue.Bus = Bus;
    Vue.prototype.$bus = Bus;
  },
  /* eslint-enable */
};
