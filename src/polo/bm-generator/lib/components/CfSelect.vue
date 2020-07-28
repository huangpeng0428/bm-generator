<template>
  <el-select
    v-model="choice"
    :clearable="entry.options.hasAll"
    :disabled="entry.disabled"
    :placeholder="placeholder"
    :multiple="entry.options.multiple"
    collapse-tags
    @visible-change="visibleChange">
    <el-option
      v-for="item in items"
      :key="item.value"
      :label="item.name"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import request from '../request'
import Helper from '../helper'

export default {
  name: 'CfSelect',

  inject: ['screen'],


  props: {
    value: {
      type: [String, Number, Boolean, Array],
      required: true,
    },

    entry: {
      type: Object,
      required: true,
    },

    extend: {
      type: Object,
      default: function() {
        return {}
      },
    },

    placeholder: {
      type: String,
      default: '',
    },
  },

  data() {
    let items = []
    if (!this.entry.isAsync) {
      //来自before_setPageConfig赋值到全局，searchform和dialog共用
       if (typeof this.entry.options.data=='string') {
          items=this.screen[this.entry.options.data]
      }else{
        if (this.entry.dataType === 'number') {
          items = this.entry.options.data.map(item => ({
            name: item.name,
            value: Number(item.value),
          }))
        } else {
          items = this.entry.options.data
        }
      }
    }

    let choice = this.value
    if (this.entry.options.multiple) {
      choice = this.value ? this.value.split(',') : [];
    }

    return {
      items,
      choice,
      cacheData: {},
      requestParamsStr: '',
    }
  },

  watch: {
    value(val) {
      let v = this.entry.options.reverse ? this.getReverseValue(val) : val

      if (this.entry.options.multiple) {
        v = v ? v.split(',') : []
      }

      if (v.toString() !== this.choice.toString()) {
        this.choice = v
      }
    },
    choice(val) {
      let v = this.entry.options.reverse ? this.getReverseValue(val) : val
      if (this.entry.options.multiple && Array.isArray(v)) {
        v = v.join(',')
      }
      this.$emit('input', v)
      this.$bus.$emit('dependencyChange',v)
    },

    // searchForm params 有改动的时候， 重置需要联级的
    extend(val) {
      if (this.entry.isAsync) {
        const params = Helper.makeParams(this.entry.options.params, val)
        if(this.requestParamsStr != Object.values(params).join('---')) {
          this.items = []
          this.choice = ''
        }
      }
    },
  },

  methods: {
    getReverseValue(val) {
      let v = val
      this.items.forEach((item) => {
        if (item.name === val) {
          v = item.value
        }
      })
      return v
    },

    // 下拉展示的时候，才请求
    visibleChange(show) {
      if (this.entry.isAsync && show) {
        this.requestData()
      }
    },

    requestData() {
      const params = Helper.makeParams(this.entry.options.params, this.extend)

      // 需要参数，但参数存在 undefined 或者 '' 不能请求
      if (Object.values(params).length > 0 && Object.values(params).filter(d => d === void 0 || d === '').length > 0) {
        this.items = []
        return
      }

      // 添加缓存
      this.requestParamsStr = Object.values(params).join('---')
      if (this.cacheData[this.requestParamsStr]) {
        this.items = this.cacheData[Object.values(params).join('---')]
        return
      }

      request({
        url: this.entry.options.url,
        method: this.entry.options.method,
        params,
      }).then((res) => {
          console.log(this,'request-------');
        Helper.handleResponse(res, () => {
          console.log(this,'handleResponse-------');
          if (this.entry.options.filter) {
            /* eslint-disable no-new-func */
            const fn = new Function('res','extend', this.entry.options.filter)
            /* eslint-enable no-new-func */
            const items = fn(res,this.extend)
            if (Array.isArray(items)) {
              this.items = items
              this.cacheData[this.requestParamsStr] = items
            } else {
              this.$msgbox({
                type: 'error',
                message: '异步下拉框数据数据异常，返回值的处理结果为非数组',
              })
              console.error('异步下拉框数据数据异常，返回值的处理结果为非数组', this.entry.options)
            }
          }

          if (this.entry.options.reverse) {
            const v = this.getReverseValue(this.value)
            this.$emit('input', v)
          }
        }, () => {
          this.$msgbox({
            type: 'error',
            message: '获取异步下拉框数据出现异常',
          })
        })
      })
    },
  },

  mounted() {
    if (this.entry.isAsync) {
      this.requestData()
    }
  },
}
</script>
