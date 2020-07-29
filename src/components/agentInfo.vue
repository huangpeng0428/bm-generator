<template>
  <div class="agent-info">
    <detail-table :detail="detail"/>
    <div class="account-info">
      <div class="table-title">查看代理信息</div>
      <el-table
        :data="info.mappings"
        class="audit-tab"
        border
        style="width: 100%">
        <el-table-column
          prop="clientUid"
          label="关联用户ID "/>
        <el-table-column
          prop="name"
          label="关联帐号名称"/>
        <el-table-column
          label="关联帐号类型">
          <template slot-scope="scope">
            <div>{{ getClientType(scope.row.clientType) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="关联时间"/>
        <el-table-column
          label="查看关联应用">
          <template slot-scope="scope">
            <div v-if="scope.row.clientType == 4 || scope.row.clientType == 5">
              <el-popover
                placement="right"
                width="300"
                trigger="click">
                <el-table
                  :data="gridData"
                  class="apps-list">
                  <el-table-column
                    width="80"
                    property="id"
                    label="应用ID"/>
                  <el-table-column
                    width="120"
                    property="name"
                    label="应用名称"/>
                </el-table>
                <el-button
                  slot="reference"
                  type="primary"
                  @click="getAppList(scope.row.clientUid)">查看</el-button>
              </el-popover>
            </div>
            <div v-else>无关联应用</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import request from '../polo/bm-generator/lib/request'
import DetailTable from './common/detailTable'

export default{
  name: 'AgentInfo',

  components: {
    DetailTable: DetailTable
  },

  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      default: 0
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
      info: {},
      agentType: [
        {
          val: 0,
          key: '广告主'
        },
        {
          val: 1,
          key: '一级代理'
        },
        {
          val: 2,
          key: '二级代理'
        }
      ],
      clientTypeMapp: [
        {
          value: 3,
          text: '一级代理下的二级代理'
        },
        {
          value: 4,
          text: '一级代理下广告主'
        },
        {
          value: 5,
          text: '二级代理下的广告主'
        }
      ],
      gridData: []
    }
  },

  computed: {
    detail() {
      return [{
        title: '代理基本信息',
        rows: [
          [
            { label: '代理用户ID：', value: this.info.uid },
            { label: '活动名称：', value: this.info.name }
          ], [
            { label: '代理类型 ', value: this.getAgentType(this.info.agentType) },
            { label: '操作者: ', value: this.info.operator }
          ], [
            { label: 'Flyme帐号：', value: this.info.flyme }
          ], [
            { label: '备注：', value: this.info.remark }
          ], [
            { label: '创建时间：', value: this.info.createTime },
            { label: '最后修改时间：', value: this.info.updateTime }
          ]
        ]
      }]
    }
  },

  watch: {
    value(val) {
      if (!val) return;
      this.getDetail();
    }
  },

  mounted() {},

  methods: {
    getDetail() {
      request({
        url: '/console/mdsp/admin/agent/info',
        method: 'GET',
        params: {
          id: this.value.uid
        }
      }).then((res) => {
        if (res.code == 200) {
          this.info = res.value
        } else {
          this.$msgbox({type: 'error', message: res.message})
        }
      })
    },
    getAgentType(type) {
      for (let i = 0; i < this.agentType.length; i++) {
        if (this.agentType[i].val == type) {
          return this.agentType[i].key;
        }
      }
    },
    getClientType(type) {
      for (let i = 0; i < this.clientTypeMapp.length; i++) {
        if (this.clientTypeMapp[i].value == type) {
          return this.clientTypeMapp[i].text;
        }
      }
    },
    getAppList(uid) {
      request({
        url: '/console/mdsp/admin/agent/app/list',
        method: 'GET',
        params: {
          sponsorId: uid
        }
      }).then((res) => {
        if (res.code == 200) {
          this.gridData = res.value
        } else {
          this.$msgbox({type: 'error', message: res.message})
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.el-popover
  .el-table__body-wrapper
    max-height: 600px;
    overflow: auto;
.agent-info
  .table-title
    font-size 15px
    font-weight bold
    text-align center
    border-bottom 1px solid #eee
    line-height 36px
    background #dedede
</style>
