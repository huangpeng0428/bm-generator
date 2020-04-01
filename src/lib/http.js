/*
 * @Date: 2020-03-27 18:20:45
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-03-31 18:44:12
 */
import axios from 'axios';
import expose from './expose'
import qs from 'qs'

const http = axios.create({

  //   baseURL: "http://admanage.meizu.com",
  baseURL: '/api',
  crossDomain: true,
  withCredentials: true
});

http.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded; charset=UTF-8';

http.interceptors.request.use(config => {
    if (typeof config.baseURL === 'undefined' && config.url.indexOf('http://') !== 0 && config.url.indexOf('https://') !== 0) {
        config.url = expose.HOST + `/${config.url}`.replace('//', '/');
    }

    if (config.data && config.url.indexOf('upload') === -1) {
        config.data = qs.stringify(config.data);
    }

    // console.log(config);
    return config
}, error => {
    console.log(error)
    return Promise.reject(error)
})

// 请求返回拦截
http.interceptors.response.use(
  result => {
    if (result.status === 200) {

      // if (result.data.state == 0) {
      //   return Promise.resolve(result.data);
      // }
      // return Promise.reject(result.data);
      return Promise.resolve(result.data);
    } else if (/^50[0-9]/.test(result.status)) {
      return Promise.reject(new Error('返回500错误'));
    } else if (/^4[0-9][0-9]/.test(result.status)) {
      return Promise.reject(new Error('返回400错误'));
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
