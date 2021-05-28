export default {
  formatDate(time, format) {
    if (!time) {
      return '';
    }
    format = format || 'yyyy-MM-dd';
    typeof time === 'number' && (time + '').length === 10 && (time *= 1000);
    if (Object.prototype.toString.call(time) !== '[object Date]') {
      if (typeof time === 'string' && /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.test(time)) {
        time = time.replace(/-/g, '/');
      }
      time = new Date(time);
    }

    // 小时的区间范围显示，比如：1：00会变成1：00~2：00
    if (format === 'hoursRange') {
      let startHours = time.getHours();
      let endHours = startHours + 1;
      return ('0' + startHours).slice(-2) + ':00 ~ ' + ('0' + endHours).slice(-2) + ':00';
    }
    const year = time.getFullYear(); // 年份
    const month = time.getMonth() + 1; // 月份
    const day = time.getDate(); //
    const hours24 = time.getHours(); // 小时
    const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minutes = time.getMinutes(); // 分
    const seconds = time.getSeconds(); // 秒
    const milliseconds = time.getMilliseconds(); // 毫秒
    let map = {
      yyyy: year,
      MM: ('0' + month).slice(-2),
      M: month,
      dd: ('0' + day).slice(-2),
      d: day,
      HH: ('0' + hours24).slice(-2),
      H: hours24,
      hh: ('0' + hours).slice(-2),
      h: hours,
      mm: ('0' + minutes).slice(-2),
      m: minutes,
      ss: ('0' + seconds).slice(-2),
      s: seconds,
      S: milliseconds,
    };
    return format.replace(/y+|M+|d+|H+|h+|m+|s+|S+/g, function(str) {
      return map[str];
    });
  },
  afterDays(date, days) {
    const daystime = days * 86400 * 1000;
    return this.formatDate(+date + daystime);
  },
  getObjectType(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1);
  },
  today() {
    const date = new Date();
    return date.getTime();
  },
  yesterday() {
    const date = new Date();
    return date.getTime() - 1000 * 3600 * 24;
  },
  findByKey(arr, key) {
    const result = arr.filter((a) => a.key === key);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  },
  copyObjectValue(obj, option) {
    let result = {};
    for (let key in obj) {
      result[key] = option[key] || obj[key];
    }
    return result;
  },
  arrayToMap(arr, key, value) {
    let ret = {};
    arr.forEach((item) => {
      ret[item[key]] = item[value];
    });
    return ret;
  },
  getStringRealLength(str) {
    if (str == null) return 0;
    if (typeof str !== 'string') {
      str += '';
    }
    /* eslint no-control-regex: "off" */
    return str.replace(/[^\x00-\xff]/g, '01').length;
  },
  newTab(location) {
    window.open(location.href, '_blank');
  },
  throttle(fn, threshhold = 250) {
    let last, timer;
    return function() {
      let context = this;
      let args = arguments;
      let now = +new Date();

      if (last && now < last + threshhold) {
        clearTimeout(timer);
        timer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  },
  debounce(fn, delay = 250) {
    let timer;
    return function() {
      let context = this;
      let args = arguments;

      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    };
  },
  deepCopy(originObj, objType) {
    const temp = objType || {};
    Object.keys(originObj).forEach((key) => {
      if (typeof originObj[key] === 'object') {
        if (originObj[key] === null) {
          temp[key] = originObj[key];
        } else {
          temp[key] = originObj[key].constructor === Array ? [] : {};
          this.deepCopy(originObj[key], temp[key]);
        }
      } else {
        temp[key] = originObj[key];
      }
    });
    return temp;
  },
  once(fn, that) {
    let called = false;
    return function() {
      if (!called) {
        called = true;
        fn.apply(that, arguments);
      }
    };
  },
};
