<template>
  <div class="tree-wrapper">
    <cf-simp-tree-node
      v-for="item in data"
      :key="item.value"
      :node="item">
    </cf-simp-tree-node>
  </div>
</template>

<script>
import CfSimpTreeNode from './CfSimpTreeNode'

export default {
  name: 'CfSimpTree',

  components: {
    CfSimpTreeNode,
  },

  props: {
    data: {
      required: true,
      type: Array,
      default: [],
    },
    value: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {
    }
  },

  watch: {
    data: {
      handler(node) {
        this.getModelValue(node)
      },
      deep: true,
    },
  },

  methods: {
    getModelValue(node) {
      const value = []

      const fn = (items) => {
        items.forEach((item) => {
          if (item.checked && typeof item.value !== 'undefined') {
            value.push(item.value)
          }

          if (item.children) {
            fn(item.children)
          }
        })
      }

      fn(node)

      this.$emit('input', value)
    },
  },

  mounted() {
    this.getModelValue(this.data)
  },
}
</script>

<style lang="stylus">
  .tree-node
    > .content
      .expand
        width 12px
        display inline-block
      i
        color #656565
        font-size 10px
        cursor pointer
</style>
