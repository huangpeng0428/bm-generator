<template>
  <div
    class="tree-node"
    style="padding-left: 16px">
    <div class="content">
      <span class="expand">
        <i
          v-if="node.children && node.children.length > 0"
          :class="['el-icon-arrow-' + (expand ? 'down' : 'right')]"
          @click.stop="expand = !expand"/>
      </span>
      <el-checkbox
        v-model="node.checked"
        :disabled="node.disabled"
        :indeterminate="indeterminate"
        @change="handleChange">
        {{ node.name }}
      </el-checkbox>
    </div>
    <div
      v-show="expand"
      class="children">
      <cf-simp-tree-node
        v-for="item in node.children"
        :key="item.value"
        :node="item"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "CfSimpTreeNode",

  props: {
    node: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      expand: true,
    };
  },

  computed: {
    indeterminate() {
      let r = false;
      let checkedCount = 0;
      let uncheckedCount = 0;
      let childCount = 0;

      const fn = (items) => {
        items.forEach((item) => {
          if (!item.disabled) {
            childCount += 1;
            if (item.checked) {
              checkedCount += 1;
            } else {
              uncheckedCount += 1;
            }
          }

          if (item.children) {
            fn(item.children);
          }
        });
      };

      console.log(childCount, checkedCount, uncheckedCount);

      if (this.node.children) {
        fn(this.node.children);
        r = checkedCount !== 0 && uncheckedCount !== 0;
        if (checkedCount === childCount && uncheckedCount === 0) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.node.checked = true;
        }
        if (checkedCount === 0 && uncheckedCount === childCount) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.node.checked = false;
        }
      } else {
        r = false;
      }

      return r;
    },
  },

  methods: {
    handleChange(evt) {
      const checked = evt.target.checked;
      /* eslint-disable no-param-reassign */
      const fn = (items) => {
        items.forEach((item) => {
          if (!item.disabled) {
            item.checked = checked;
          }
          if (item.children) {
            fn(item.children);
          }
        });
      };
      if (this.node.children) {
        fn(this.node.children);
      }
      /* eslint-enable no-param-reassign */
    },
  },
};
</script>
