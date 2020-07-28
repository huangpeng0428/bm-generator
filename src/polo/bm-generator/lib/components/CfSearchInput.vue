<template>
  <el-select
    v-model="choice"
    :loading="loading"
    :multiple="entry.options.multiple"
    :filterable="true"
    :clearable="true"
    :remote="entry.options.remote"
    :remote-method="queryItems"
    :disabled="entry.disabled"
    :placeholder="placeholder"
    @change="changeValue">
    <el-option
      v-for="(item, i) in items"
      :key="i + '-' + item.value"
      :label="item.name"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import request from '../request'
import Helper from '../helper'

export default {
  name: 'CfSearchInput',

  props: {
    value: {
      required: true,
    },

    entry: {
      type: Object,
      required: true,
    },

    placeholder: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      choice: this.value,
      items: [],
      allItems: [],
      loading: false,
    }
  },

  mounted() {
    // 本地搜索，则先获取全部数据
    if (this.entry.options.remote && !this.entry.options.param) {
      this.requestData()
    }
  },

  watch: {
    value(val) {
      this.choice = val
    }
  },

  methods: {
    changeValue(val) {
      this.choice = val
      this.$emit('input', val)
    },

    requestData(params = {}) {
      this.loading = true
      request({
        url: this.entry.options.url,
        method: this.entry.options.method,
        params,
      }).then((res) => {
        this.loading = false
        Helper.handleResponse(res, () => {
          if (this.entry.options.filter) {
            /* eslint-disable no-new-func */
            const fn = new Function('res', this.entry.options.filter)
            /* eslint-enable no-new-func */
            this.allItems = fn(res)
          } else {
            this.allItems = res.value.data
          }
          this.items = this.allItems.slice(0, 100)
        }, () => {
          this.$message({
            type: 'error',
            message: '获取搜索输入数据出现异常',
          })
        })
      })
    },

    queryItems(query) {
      if (query) {
        if (this.entry.options.param) {
          const params = { [this.entry.options.param]: query, }
          this.requestData(params)
        } else {
          this.items = this.allItems
                        .filter(
                          p => p.name
                                .toLowerCase()
                                .indexOf(query.toLowerCase()) > -1
                        ).slice(0, 100)
        }
      } else {
        this.items = this.allItems.slice(0, 100)
      }
    },
  },
}
</script>
