<template>
  <div>
    <el-form
      ref="form_1"
      :model="formData"
      :rules="rules"
      label-width="150px">
      <h3 class="form-title">企业信息</h3>
      <el-form-item
        label="Flyme帐号"
        prop="flyme">
        <el-input
          v-model="formData.flyme"
          :maxlength="25"
          :disabled="isView"
          placeholder="请输入Flyme帐号  用于登录、找回密码"/>
      </el-form-item>
      <el-form-item
        label="公司名称"
        prop="name">
        <el-input
          v-model="formData.name"
          :maxlength="60"
          :disabled="isView"/>
      </el-form-item>
      <el-form-item
        label="联系人"
        prop="contact">
        <el-input
          v-model="formData.contact"
          :maxlength="25"
          :disabled="isView"/>
      </el-form-item>
      <el-form-item
        label="联系电话"
        prop="phone">
        <el-input
          v-model="formData.phone"
          :maxlength="25"
          :disabled="isView"/>
      </el-form-item>
      <el-form-item
        label="联系邮箱"
        prop="email">
        <el-input
          v-model="formData.email"
          :maxlength="125"
          :disabled="isView"/>
      </el-form-item>
      <el-form-item
        label="联系地址"
        prop="address">
        <el-input
          v-model="formData.address"
          :maxlength="125"
          :disabled="isView"/>
      </el-form-item>
      <h3 class="form-title">财务信息</h3>
      <el-form-item
        label="开户银行"
        prop="depositBank">
        <el-input
          v-model="formData.depositBank"
          :maxlength="60"
          :disabled="isView"/>
      </el-form-item>
      <el-form-item
        label="开户地"
        prop="depositCity">
        <el-cascader
          v-model="formData.depositCity"
          :options="cityData"
          :disabled="isView"
          change-on-select
        />
      </el-form-item>
      <el-form-item
        label="银行帐号"
        prop="bankAccount"
        style="margin-right:50%;">
        <el-input
          v-model="formData.bankAccount"
          :maxlength="25"
          :disabled="isView"/>
      </el-form-item>
      <h3 class="form-title">账户配置</h3>
      <el-form-item
        label="所属商务部门"
        prop="partment">
        <el-input
          v-model="formData.partment"
          disabled/>
      </el-form-item>
      <el-form-item
        label="代理级别"
        prop="agentType">
        <el-select
          v-model="formData.agentType"
          :disabled="isView || actionType === 'update'">
          <el-option
            label="一级代理"
            value="1"/>
          <el-option
            v-if="actionType !== 'add'"
            label="二级代理"
            value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item
        label="账户类型"
        prop="accountType">
        <el-select
          v-model="formData.accountType"
          :disabled="isView">
          <el-option
            label="正式账户"
            value="1"/>
          <el-option
            label="测试账户"
            value="2"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="所属一代" prop="agentOneName">
        <el-select v-model="formData.agentOneName" :disabled="isView">
          <el-option v-for="item in agentOneData"
            :key="item.userId"
            :label="item.name"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div class="btn-wrap">
      <el-button @click="closeDialog(false)">取消</el-button>
      <el-button
        type="primary"
        @click="onSave">保存</el-button>
    </div>
  </div>
</template>
<script>
import validateMixin from '../mixins/validate'
import request from '../polo/bm-generator/lib/request'
import { phoneValidator } from '../validators/user'
import helper from '../helper'
export default {
  mixins: [validateMixin],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: null,
    field: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formData: this.initFormData(),
      rules: {
        flyme: { required: true, message: '请输入Flyme帐号', trigger: 'change' },
        name: { required: true, message: '请输入公司名称', trigger: 'change' },
        contact: { required: true, message: '请输入联系人', trigger: 'change' },
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'change' },
          { validator: phoneValidator.bind(this, '联系电话'), trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入联系邮箱', trigger: 'change' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        address: { required: true, message: '请输入联系地址', trigger: 'change' },
        accountType: { required: true, message: '请选择账户类型', trigger: 'change' },
        agentType: { required: true, message: '请选择代理级别', trigger: 'change' }
      },
      cityData: [],
      agentOneData: [],
      isView: false,
      actionType: 'add'
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.formData = this.initFormData()
        this.isView = false
      } else {
        if (Object.keys(val).length > 0) {
          this.actionType = 'update'
          val.depositCity = val.depositCity.split(',')
          val.accountType = String(val.accountType)
          val.agentType = String(val.agentType)
          this.formData = val
          if (val.hasOwnProperty('isView')) this.isView = val.isView
        } else {
          this.actionType = 'add'
        }
      }
    }
  },
  created() {
    this.getCityData()
    this.getAgentOneData()
  },
  methods: {
    initFormData() {
      return {
        uid: '',
        newUid: '',
        agentType: '1',
        flyme: '',
        name: '',
        contact: '',
        phone: '',
        email: '',
        address: '',
        depositBank: '',
        depositCity: [],
        bankAccount: '',
        partment: '代理组',
        accountType: '1'
      }
    },
    async onSave() {
      const valid = await this.validate()
      if (valid) {
        const data = helper.deepCopy(this.formData)
        data.depositCity = data.depositCity.join(',')
        request({
          url: `/console/mdsp/admin/agent/${this.actionType === 'add' ? 'add' : 'save'}`,
          method: 'POST',
          data
        }).then(res => {
          if (res.code == 200) {
            this.$msgbox({
              type: 'success',
              message: '保存成功'
            })
            this.closeDialog(true)
          } else {
            this.$msgbox({
              type: 'error',
              message: res.message || '服务端错误'
            })
          }
        })
      }
    },
    getCityData() {
      request({
        url: '/console/mdsp/admin/agent/city',
        method: 'GET',
        params: {}
      }).then(res => {
        if (res.code == 200) {
          this.cityData = Object.keys(res.value).map(key => {
            return {
              value: key,
              label: key,
              children: res.value[key].map(city => {
                return {
                  value: city.fname,
                  label: city.fname
                }
              })
            }
          })
        }
      })
    },
    getAgentOneData() {
      request({
        url: '/console/mdsp/admin/agent/agentOne',
        method: 'GET',
        params: {}
      }).then(res => {
        if (res.code == 200) {
          this.agentOneData = res.value
        }
      })
    },
    closeDialog(flushList = false) {
      let eles = document.querySelectorAll('.el-dialog__headerbtn')
      eles[0].click()
      flushList && document.querySelector('.search-buttons').querySelector('.el-button').click()
    }
  }
}
</script>
<style lang="stylus" scoped>
.el-form {
  overflow: hidden;
  .form-title {
    margin: 0 0 20px 0;
    line-height: 50px;
    padding-left: 20px;
    border-bottom: 1px solid #ebebeb;
  }
  .el-form-item {
    width: 50%;
    height: 40px;
    float: left;
  }
}
 .btn-wrap
    margin-bottom: -80px;
    overflow: hidden;
    button
      float: right;
      margin: 20px 0 0 15px;
</style>
