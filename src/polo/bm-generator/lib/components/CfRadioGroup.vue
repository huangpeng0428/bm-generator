<template>
  <div>
    <el-radio-group v-model="selected" @change="handleChange">
      <el-radio v-for="item in items"
        :key="item.value"
        :label="item.value">
        {{ item.name }}
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import request from '../request'
import Helper from '../helper'

export default {
  name: 'CfRadioGroup',

  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    entry: {
      type: Object,
      required: true,
    },
    extend: {
      type: Object,
      default() {
        return {}
      },
    },
    origin: {
      type: String,
      default: 'searchForm',
    },
  },

  data() {
    let items = []
    if (!this.entry.isAsync) {
      items = this.entry.options.data.map(o => {
        if (this.entry.dataType === 'number') {
          o.value = parseInt(o.value)
        }
        return o
      })
    }

    return {
      items,
      selected: this.value,
    }
  },

  watch: {
    value(val) {
      this.selected = val
    },

    extend(val, oldVal) {
      if (this.origin === 'dialog' &&
        this.extend.dialog.show === true &&
        val.model.id != oldVal.model.id) {
        this.loadData()
      }
    },
  },

  methods: {
    handleChange(val) {
      this.$emit('input', val)
    },

    loadData() {
      const params = Helper.makeParams(this.entry.options.params, this.origin === 'dialog' ? this.extend.model : this.extend)

      request({
        url: this.entry.options.url,
        method: this.entry.options.method,
        params,
      }).then((res) => {
        Helper.handleResponse(res, () => {
          if (this.entry.options.filter) {
            /* eslint-disable no-new-func */
            const fn = new Function('res', this.entry.options.filter)
            /* eslint-enable no-new-func */
            const items = fn(res)
            if (Array.isArray(items)) {
              this.items = items.map(o => {
                if (this.entry.dataType === 'number') {
                  o.value = parseInt(o.value)
                }
                return o
              })
            } else {
              this.$msgbox({
                type: 'error',
                message: '异步单选框数据异常，返回值的处理结果为非数组',
              })
              console.error('异步单选框数据异常，返回值的处理结果为非数组', this.entry.options)
            }
          } else {
            this.$msgbox({
              type: 'error',
              message: '必须提供异步单选框的处理过滤器',
            })
          }
        }, () => {
          this.$msgbox({
            type: 'error',
            message: '获取异步单选框数据出现异常',
          })
        })
      })
    },
  },

  mounted() {
    if (this.entry.isAsync) {
      this.loadData()
    }
  },
}
</script>
