<template>
  <div>
    <el-checkbox
      v-if="allCheckbox"
      :indeterminate="isIndeterminate"
      v-model="isAll"
      @change="handleSelectAll">
      全选
    </el-checkbox>

    <el-checkbox-group v-model="selected" @change="handleChange">
      <el-checkbox
        v-for="item in items"
        :key="item.value"
        :label="item.value"
        :disabled="item.disabled">
        {{item.name}}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import request from '../request'
import Helper from '../helper'

export default {
  name: 'CfCheckboxGroup',

  props: {
    value: {
      type: Array,
      default() {
        return []
      },
      required: true,
    },
    allCheckbox: {
      type: Boolean,
      default: true,
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
      items = this.entry.options.data
    }

    return {
      items,
      selected: [],
    }
  },

  computed: {
    isIndeterminate() {
      return this.selected.length > 0 && !this.isAll
    },

    isAll() {
      let isAll = true

      this.items.filter(item => !item.disabled).forEach((item) => {
        if (this.selected.indexOf(item.value) === -1) {
          isAll = false
        }
      })

      return isAll
    },
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

    handleSelectAll(event) {
      if (event.target.checked) {
        this.selected = this.items.filter(item => !item.disabled).map(item => item.value)
      } else {
        this.selected = []
      }
      this.$emit('input', this.selected)
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
              this.items = items
              this.selected = []
              items.forEach((item) => {
                if (item.checked) {
                  this.selected.push(item.value)
                }
              })
              this.$emit('input', this.selected)
            } else {
              this.$msgbox({
                type: 'error',
                message: '异步多选框数据异常，返回值的处理结果为非数组',
              })
              console.error('异步多选框数据异常，返回值的处理结果为非数组', this.entry.options)
            }
          } else {
            this.$msgbox({
              type: 'error',
              message: '必须提供异步多选框的处理过滤器',
            })
          }
        }, () => {
          this.$msgbox({
            type: 'error',
            message: '获取异步多选框数据出现异常',
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
