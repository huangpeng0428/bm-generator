<template>
  <el-table :data="items">
    <el-table-column label="属性名" prop="name" align="center">
    </el-table-column>
    <el-table-column label="属性值" prop="value" align="center">
    </el-table-column>
    <el-table-column
      align="center"
      :render-header="renderHeader">
      <template slot-scope="scope">
        <slot :row="scope.row" :index="scope.$index">
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'CfObjectTable',

  props: {
    data: {
      type: Object,
      required: true,
    },

    showOperations: {
      type: Boolean,
      default: true,
    },

    renderHeader: {
      type: Function,
      /* eslint-disable no-unused-vars */
      default(h) {
        return (
          <span>操作</span>
        )
      },
      /* eslint-enable no-unused-vars */
    },
  },

  data() {
    return {
    }
  },

  computed: {
    items() {
      const items = []

      Object.keys(this.data).forEach((name) => {
        items.push({
          name,
          value: this.data[name],
        })
      })

      return items
    },
  },
}
</script>
