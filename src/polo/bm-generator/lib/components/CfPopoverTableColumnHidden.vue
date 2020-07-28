<template>
  <div>
    <el-popover
      ref="popover"
      placement="bottom"
      width="600"
      trigger="click">
      <el-checkbox-group
        v-model="selected"
        :min="1"
        @change="handleChange">
        <el-form-item :label="key"
          :key="key"
          v-for="(value, key) in entry.options.data">
          <el-checkbox v-for="column in value"
            :label="column.field"
            :style="{width: '120px'}"
            :disabled="entry.options.limit > 0 && selected.length >= entry.options.limit && selected.indexOf(column.field) == -1"
            :key="column.field">
              {{column.title}}
          </el-checkbox>
        </el-form-item>
        <p class="limit-message" v-if="entry.options.limit > 0">最多只可选择{{ entry.options.limit }}个指标</p>
      </el-checkbox-group>
    </el-popover>
    <el-button type="text" v-popover:popover>更多指标</el-button>
  </div>
</template>

<script>
import Helper from '../helper'

export default {
  name: 'CfPopoverTableColumnHidden',

  props: {
    value: {
      type: Array,
      default: [],
    },

    entry: {
      type: Object,
      default: {},
    },
  },

  data() {
    return {
      selected: this.value, // 默认
    }
  },

  watch: {
    value(val) {
      this.selected = val
    },
  },

  computed: {
  },

  methods: {
    handleChange(val) {
      this.$emit('input', val)
    },
  }
}
</script>
<style lang="stylus">
.el-popover
  .limit-message
    color: #c73b3b
    font-size 12px
    text-align center
</style>
