<template>
  <el-cascader
    v-model="selected"
    :options="items"
    :show-all-levels="entry.options.showFullPath"
    :disabled="entry.disabled"
    @active-item-change="activeItemChange"
    @change="changeValue">
  </el-cascader>
</template>

<script>
import request from '../request'
import Helper from '../helper'

export default {
  name: 'CfCascader',

  props: {
    value: {
      required: true,
    },
    entry: {
      type: Object,
      required: true,
    },
  },

  data() {
    let items = []
    if (!this.entry.isAsync) {
      items = Helper.jsonParse(this.entry.options.data)
    }

    return {
      items,
      selected: this.value || [],
    }
  },

  watch: {
    value(val) {
      // this.selected = val
      this.selected = Helper.jsonParse(val)
      // if(Array.isArray(val) && val.length > 0) {
      //   val = val[val.length - 1]
      // }
      // if (val === '') {
      //   this.selected = []
      // } else if (val !== this.selected[this.selected.length - 1]) {
      //   this.selected = this.searchItem(this.items, val)
      // }
    },
  },

  methods: {
    changeValue(val) {
      // const v = val[val.length - 1]
      this.$emit('input', val)
    },

    findItem(items, val) {
      let result = null

      items.forEach((item) => {
        if (item.value === val) {
          result = item
        }
      })

      return result
    },

    activeItemChange(val) {
      if (this.entry.options.item && this.entry.options.item.url) {
        const copy = [].concat([], val)
        let item = null
        let value = copy.shift()
        let items = this.items


        do {
          item = this.findItem(items, value)
          items = item.children
          value = copy.shift()
        } while (copy.length)

        if (item.children.length !== 0) return

        const params = Helper.makeParams(this.entry.options.item.params, {
          value: val[val.length - 1],
          selected: val,
        })

        const req = this.entry.options.item

        request({
          url: req.url,
          method: req.method,
          params,
        }).then((res) => {
          Helper.handleResponse(res, () => {
            let result = []
            if (req.filter) {
              /* eslint-disable no-new-func */
              const fn = new Function('res', req.filter)
              /* eslint-enable no-new-func */
              result = fn(res)
            } else {
              result = res
            }

            item.children = result
          }, () => {
            this.$message({
              type: 'error',
              message: '获取下级菜单数据出现异常',
            })
          })
        })
      }
    },

    searchItem(items, val) {
      let result = []

      items.forEach((item) => {
        if (item.value === val) {
          result.push(item.value)
        } else if (item.children) {
          const r = this.searchItem(item.children, val)
          if (r.length > 0) {
            result = [].concat(result, [item.value], r)
          }
        }
      })

      return result
    },
  },

  mounted() {
    if (this.entry.isAsync) {
      const params = Helper.makeParams(this.entry.options.params)

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
            this.items = fn(res)
          } else {
            this.items = res
          }
        }, () => {
          this.$msgbox({
            type: 'error',
            message: '获取级联选择控件数据出现异常',
          })
        })
      })
    }
  },
}
</script>
