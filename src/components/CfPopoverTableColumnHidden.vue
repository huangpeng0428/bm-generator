<!--
 * @Date: 2020-07-23 16:30:51
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-23 16:31:59
-->
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
        <el-form-item
          v-for="(value, key) in entry.options.data"
          :label="key"
          :key="key">
          <el-checkbox
            v-for="column in value"
            :label="column.field"
            :style="{width: '120px'}"
            :disabled="entry.options.limit > 0 && selected.length >= entry.options.limit && selected.indexOf(column.field) == -1"
            :key="column.field">
            {{ column.title }}
          </el-checkbox>
        </el-form-item>
        <p
          v-if="entry.options.limit > 0"
          class="limit-message">最多只可选择{{ entry.options.limit }}个指标</p>
      </el-checkbox-group>
    </el-popover>
    <el-button
      v-popover:popover
      type="text">更多指标</el-button>
  </div>
</template>

<script>

export default {
  name: 'CfPopoverTableColumnHidden',

  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },

    entry: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {
      selected: this.value // 默认
    }
  },

  computed: {
  },

  watch: {
    value(val) {
      this.selected = val
    }
  },

  methods: {
    handleChange(val) {
      this.$emit('input', val)
    }
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
