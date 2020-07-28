/*
 * @Date: 2020-07-28 15:55:57
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-28 15:56:03
 */
import request from './request'

// POST 修改用户信息
export const postUserProfile = (params, isUpdate) => {
  const action = isUpdate ? 'update' : 'add'
  return request.post(`/console/mdsp/sponsor/${action}`, params).then(res => {
    if (res.code === 200) {
      return getUserProfile()
    }
      return Promise.reject(res.message)

  })
}

// GET 广告主资质分类  type : 行业类型 0 行业资质，1 公司行业
export const getCertCategoryList = (type = 0) => {
  return request.get('/console/mdsp/sponsor/cert_category', { params: { type } }).then(res => {
    return res.code === 200 ? res.value : []
  })
}

// GET 主体资质类型
export const getNameAndValue = type => request.get('/console/mdsp/admin/sponsor/getNameAndValue', { params: { type } })

// GET 用户详情
export const getUserProfile = agentSponsorId => request.get('/console/mdsp/sponsor/get', { params: { agent_sponsor_id: agentSponsorId } })

// GET 广告主详情
export const getSponsorDetail = sponsorId => request.get('/console/mdsp/admin/sponsor/detail', { params: { sponsorId } })

// GET 代理商
export const getAgentOne = () => request.get('/console/mdsp/admin/agent/agentOne')

// POST 广告主审核
export const auditSponsor = (params, isUpdate) => {
  const action = isUpdate ? 'update/audit' : 'audit'
  return request.post(`/console/mdsp/admin/sponsor/${action}`, params)
}
