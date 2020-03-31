/*
 * @Date: 2020-03-27 18:20:45
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-03-31 17:50:42
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
    console.log(typeof config.baseURL === 'undefined');
    if (typeof config.baseURL === 'undefined' && config.url.indexOf('http://') !== 0 && config.url.indexOf('https://') !== 0) {
        config.url = expose.HOST + `/${config.url}`.replace('//', '/');
    }

    if (config.data && config.url.indexOf('upload') === -1) {
        config.data = qs.stringify(config.data);
    }
    console.log(config);
    return config
}, error => {
    console.log(error)
    return Promise.reject(error)
})

export default http;
