const helper = {
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
  }
};
export default helper
