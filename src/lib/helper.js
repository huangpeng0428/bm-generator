/*
 * @Date: 2020-03-30 17:48:15
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-03-31 16:17:23
 */
const helper = {
  isPureObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]'
  },

  assign(target, ...args) {
    args.forEach(arg => {
      Object.keys(arg).forEach(prop => {
        if (typeof arg[prop] === 'object') {
          if (Array.isArray(arg[prop])) {
            target[prop] = [].concat([], arg[prop]);
          } else if (helper.isPureObject(arg[prop])) {
            target[prop] = Object.assign({}, arg[prop]);
          } else {
            target[prop] = arg[prop];
          }
        } else {
          target[prop] = arg[prop];
        }
      });
    });
    return target;
  },

  convertMapToArray(source, labelName = 'label', valueName = 'value') {
    return Object.keys(source)
                  .map(prop => ({
                    [labelName]: source[prop],
                    [valueName]: prop
                  }))
  }
};
export default helper
