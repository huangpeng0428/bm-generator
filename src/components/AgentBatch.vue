<template>
  <div class="dialgo-slot-set agent-batch-dialog">
    <div v-if="isRender">
      <div class="sdk-slot">
        <!-- <h3 class="slot-title"></h3> -->
        <div class="sele-group">
          <el-form-item label="代理商名称">
            <el-input v-model="searchParams.name"/>
          </el-form-item>
          <el-form-item label="账号ID">
            <el-input v-model="searchParams.agentId"/>
          </el-form-item>
          <!-- <el-form-item label="代理级别">
          <el-select clearable v-model="searchParams.type">
            <el-option label="一级代理" value="1"></el-option>
            <el-option label="二级代理" value="2"></el-option>
          </el-select>
        </el-form-item> -->
          <el-form-item label="所属一代">
            <el-select
              v-model="searchParams.agentOne"
              clearable>
              <el-option
                v-for="item in agentOneData"
                :key="item.uid"
                :label="item.name"
                :value="item.uid"/>
            </el-select>
          </el-form-item>
        </div>
        <div class="sele-wrap">
          <tree-transfer
            v-if="agentTreeTransferShow"
            :data-check="agents"
            :default-data-checked-id="agentCheckList"
            :data-default="defaultAgents"
            :expand-all-left="true"
            :tree-transfer-title="treeTransferTitle"
            @checkDataChang="setAgentCheckList"/>
        </div>
        <div>
          <el-form-item label="选择部门">代理组</el-form-item>
          <el-form-item label="所属一代">
            <el-select
              v-model="agentOne"
              clearable>
              <el-option
                v-for="item in agentOneData"
                :key="item.uid"
                :label="item.name"
                :value="item.uid"/>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="btn-wrap">
        <el-button @click="closeDialog(false)">取消</el-button>
        <el-button
          type="primary"
          @click="bindAgent(false)">转移</el-button>
      </div>
      <div
        v-show="showConfirmDialog"
        class="confirm-wrap">
        <h3>确认转移以下账户：</h3>
        <el-table
          :data="tableData"
          height="500"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="账户ID"
            width="180"/>
          <el-table-column
            prop="name"
            label="公司名称"/>
        </el-table>
        <div class="confirm-footer">
          <el-button @click="showConfirmDialog=false">取消</el-button>
          <el-button
            type="primary"
            @click="bindAgent(true)">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '../polo/bm-generator/lib/request'
import Helper from '../helper'
import TreeTransfer from './common/TreeTransfer'
export default {
  components: {
    TreeTransfer
  },
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    field: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      searchParams: {
        name: '',
        agentId: '',
        type: 2,
        agentOne: ''
      },
      agentOneData: [],
      agentList: [],
      agentTreeTransferShow: false,
      agents: [],
      agentCheckList: [],
      defaultAgents: [],
      treeTransferTitle: {
        left: '备选代理/广告主',
        right: '已选代理/广告主'
      },
      agentOne: '',
      showConfirmDialog: false,
      isRender: false
    }
  },
  computed: {
    tableData() {
      if (this.defaultAgents.length > 0) {
        return this.defaultAgents[0].slot.filter(item => {
          if (this.agentCheckList.indexOf(item.id) > -1) {
            return item
          }
        })
      }
        return []

    }
  },
  watch: {
    value(val) {
      // eslint-disable-next-line no-return-assign
      if (!val) return this.isRender = false
      if (typeof val === 'object') {
        this.agentOne = ''
        this.searchParams = {
          name: '',
          agentId: '',
          type: '',
          agentOne: ''
        }
        this.agents = []
        this.agentCheckList = []
        this.defaultAgents = []
        this.showConfirmDialog = false
        this.getAgentOneData()
        this.getAgentList(this.searchParams)
      }
    },
    searchParams: {
      handler(val) {
        this.getAgentList(val)
      },
      deep: true
    }
  },
  created() {
    this.getAgentOneData()
    this.getAgentList(this.searchParams)
  },
  methods: {
    getAgentOneData() {
      request({
        url: '/console/mdsp/admin/agent/list',
        method: 'GET',
        params: {
          type: 1
        }
      }).then(res => {
        if (res.code == 200) {
          this.agentOneData = res.value.data
        }
      })
    },
    getAgentList(params) {
      request({
        url: 'console/mdsp/admin/agent/list',
        method: 'GET',
        params
      }).then(res => {
        if (res.code == 200) {
          const agentList = res.value.data.map(agent => {
            return {
              name: `${agent.uid} - ${agent.name}`,
              id: agent.uid
            }
          })
          this.agents = Helper.formatSlotData(
          [{
            all: '全选',
            agents: agentList
          }], 'all', 'agents')
          if (!params.name && !params.agentOne) {
            this.defaultAgents = Helper.deepCopy(this.agents, [])
            this.agentTreeTransferShow = true
          }
        }
        this.isRender = true
      })
    },
    bindAgent(confirm = false) {
      const agentTwo = this.agentCheckList.join(',')
      let errorMsg = ''
      if (!agentTwo) {
        errorMsg = '请选择代理/广告主'
      } else if (!this.agentOne) {
        errorMsg = '请选择所属一代'
      }
      if (errorMsg) {
        return this.$msgbox({
          type: 'error',
          message: errorMsg
        })
      }
      // eslint-disable-next-line no-return-assign
      if (!confirm) return this.showConfirmDialog = true
      request({
        url: 'console/mdsp/admin/agent/binding/secondAgent',
        method: 'GET',
        params: {
          agentOne: this.agentOne,
          agentTwo
        }
      }).then(res => {
        if (res.code == 200) {
          this.agentOneData = res.value
          this.$msgbox({
            type: 'success',
            message: '转移成功'
          })
          this.closeDialog(true)
        } else {
          this.$msgbox({
            type: 'error',
            message: res.message || '服务端错误'
          })
        }
      })
    },
    setAgentCheckList(checkedId) {
      this.agentCheckList = checkedId
    },
    closeDialog(flushList = false) {
      let eles = document.querySelectorAll('.el-dialog__headerbtn')
      eles[2].click()
      flushList && document.querySelector('.search-buttons').querySelector('.el-button').click()
    }
  }
}
</script>

<style lang="stylus" scoped>
.agent-batch-dialog {
  .sele-wrap {
    height: 400px;
    overflow-y: scroll;
  }
  .confirm-wrap {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 100%;
    background: #fff;
    padding: 30px 100px;
  }
  .confirm-footer {
    margin-top 60px;
    .el-button {
      float: right;
      margin-left 10px;
    }
  }
}
.btn-wrap
  margin-bottom: -80px;
  overflow: hidden;
  button
    float: right;
    margin: 20px 0 0 15px;
</style>
