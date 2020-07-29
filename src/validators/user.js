import utils from '../utils'
export const companyNameValidator = function (name, rule, value, callback) {
  if (!/^[a-zA-Z(（][a-zA-Z()（）\x20]*[a-zA-Z)）]$|^[a-zA-Z0-9()（）\u2e88-\u9fff]+$/.test(value)) {
    callback(new Error(`${name}包含特殊字符`))
  } else if (utils.getStringRealLength(value) > 60) {
    callback(new Error(`${name}最多30个字`))
  } else {
    callback()
  }
}
export const identityValidator = function (name, rule, value, callback) {
  if (value && !/(^\d{15}$)|(^\d{17}([0-9]|[Xx])$)/.test(value)) {
    callback(new Error(`${name}格式不正确`))
  } else {
    callback()
  }
}
export const phoneValidator = function (name, rule, value, callback) {
  if (value && !/^[+]?([0-9]+-?)*[0-9]$/.test(value)) {
    callback(new Error(`${name}格式不正确`))
  } else {
    callback()
  }
}