/*
 * @Date: 2020-07-28 15:55:57
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-28 15:56:12
 */
import axios from 'axios';
import qs from 'qs';

const ERROR_MSG = '服务器错误，请稍候再试';
const request = axios.create({
  crossDomain: true,
  withCredentials: true,
});
request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Add a request interceptor
request.interceptors.request.use(
  (config) => {
    // Add params.t=[now] when request method is GET
    if (config.method === 'get') {
      const params = config.params || {};
      if (params.nocache) {
        params.t = new Date().getTime();
        config.params = params;
        delete params.nocache;
      }
    } else if (config.data) {
      config.data = qs.stringify(config.data);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor
request.interceptors.response.use(
  (response) => {
    console.log('response', response);
    const data = response.data;
    if (data instanceof Object) {
      if (data && data.code === 198001) {
        if (~data.message.indexOf('登录')) {
          window.location.href = '/uc/login';
          return;
        }
      }
      if (data && data.code === 198000) {
        if (~data.message.indexOf('授权')) {
          window.location.href = '/logout';
          return;
        }
      }
      if (data && data.code !== 200) {
        let message;
        if (typeof data.message !== 'undefined') {
          message = data.message;
        } else if (typeof data.model !== 'undefined') {
          message = data.model.message;
        }
        return Promise.reject(new Error(message || ERROR_MSG));
      }
    } else {
      return Promise.resolve(response);

      // return response
    }
    return response.data;
  },
  (error) => {
    const message = error.message || ERROR_MSG;
    return Promise.reject(new Error(message));
  },
);

request.export = function(url, { params }) {
  const { pageSize, pageNumber, ...args } = params;
  const exportUrl = `${url}?${qs.stringify(args)}`;
  window.open(exportUrl);
};

export default request;
