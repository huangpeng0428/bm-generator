/*
 * @Date: 2020-07-27 15:36:02
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-27 16:34:13
 */
import axios from 'axios';
import expose from '../expose';
import qs from 'qs';

const request = axios.create({
  crossDomain: true,
  withCredentials: true
});

request.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded; charset=UTF-8';

// Add a request interceptor
request.interceptors.request.use(
  function(config) {

    // Do something before request is sent
    // 重构 url;
    if (
      typeof config.baseURL == 'undefined' &&
      config.url.indexOf('http://') != 0 &&
      config.url.indexOf('https://') != 0
    ) {
      config.url = expose.HOST + `/${config.url}`.replace('//', '/');
    }
    if (config.data && !~config.url.indexOf('upload')) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  function(error) {

    // Do something with request error
    console.log(error);
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function(response) {
    console.log(response);
    return response.data;
  },
  function(error) {
    console.log('error', error);
    const message = error.message || '服务器内部错误';
    return Promise.reject(new Error(message));
  }
);

export default request;
