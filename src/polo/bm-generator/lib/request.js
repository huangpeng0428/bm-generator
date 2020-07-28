import axios from 'axios'
import Config from './config'
import expose from './expose'
import qs from 'qs'

const request = axios.create({
  crossDomain: true,
  withCredentials: true,
})

request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'

// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  //重构 url;
  if(typeof config.baseURL == 'undefined' && config.url.indexOf('http://') != 0 && config.url.indexOf('https://') != 0) {
    config.url = expose.HOST + (`/${config.url}` ).replace('//','/')
  }
  if(config.data && !~config.url.indexOf('upload')) {
    config.data = qs.stringify(config.data)
  }
  return config
}, function (error) {
  // Do something with request error
  console.log(error)
  return Promise.reject(error)
})

export default request
