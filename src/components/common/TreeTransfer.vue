<template>
  <div class="tree-transfer-wrap">
    <div class="tree-left">
      <h3>{{ treeTransferTitle.left }}</h3>
      <el-tree
        ref="treeLeft"
        :data="dataCheck"
        :default-expand-all="expandAllLeft"
        :render-after-expand="false"
        :default-checked-keys="defaultDataCheckedId"
        :lazy="isLazy"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        highlight-current
        @check-change="handleCheckChange"/>
    </div>
    <div class="tree-right">
      <h3>{{ treeTransferTitle.right }}</h3>
      <el-tree
        ref="treeRight"
        :data="dataChecked"
        :lazy="isLazy"
        :props="defaultProps"
        default-expand-all
        highlight-current>
        <span
          slot-scope="{ node, data }"
          class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span v-if="!hideDelete">
            <el-button
              type="text"
              size="mini"
              @click="(
            ) => handleRemove(node, data)">
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
import Helper from "../../helper";

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dataCheck: Array,
    // eslint-disable-next-line vue/require-default-prop
    defaultDataCheckedId: Array,
    // eslint-disable-next-line vue/require-default-prop
    dataDefault: Array,
    // eslint-disable-next-line vue/require-default-prop
    hideDelete: false,
    // eslint-disable-next-line vue/require-default-prop
    expandAllLeft: false,
    // eslint-disable-next-line vue/require-default-prop
    isLazy: true,
    treeTransferTitle: {
      type: Object,
      default: () => {
        return {
          left: "备选位置",
          right: "已选位置",
        };
      },
    },
  },

  data() {
    let dataChecked = this.getDataChecked(this.defaultDataCheckedId, true);
    let dataCheckedId = Helper.deepCopy(this.defaultDataCheckedId, []);
    return {
      defaultProps: {
        children: "slot",
        label: "name",
      },
      dataCheckedId: dataCheckedId,
      dataChecked: dataChecked,
    };
  },

  computed: {},

  watch: {
    dataCheckedId: {
      // 选中的id
      handler(val) {
        this.$emit("checkDataChang", val);
      },
      deep: true,
    },
    defaultDataCheckedId: {
      // 传入时选中
      handler(val) {},
    },
    dataChecked: {
      // 右边tree
      handler(val) {},
    },
  },

  mounted() {
    this.debounceFn = this.debounce(this.getDataChecked, 200);
  },

  methods: {
    handleRemove(node, data) {
      if (!data.hasOwnProperty("slot") && node.parent.childNodes.length === 1) {
        return this.handleRemove(node.parent, node.parent.data);
      }
      const parent = node.parent;
      const children = parent.data.slot || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      this.dataCheckedId = this.getChckedIds();
      this.$refs.treeLeft.setCheckedKeys(this.dataCheckedId);
    },
    handleCheckChange(data, checked, indeterminate) {
      if (data.hasOwnProperty("slot")) return;
      if (checked) {
        // console.log(data.id)
        this.dataCheckedId.push(data.id);
      } else {
        let idx = this.dataCheckedId.indexOf(data.id);

        // console.log(idx)
        if (idx > -1) {
          this.dataCheckedId.splice(idx, 1);
        }

        // console.log(data.id)
      }
      this.debounceFn();
    },
    getDataChecked(checkedId, isReturn = false) {
      let dataCheckedId = checkedId || this.dataCheckedId;
      let dataChecked = [];
      this.dataDefault.forEach((item) => {
        let slotArr = [];
        item.slot.forEach((slot) => {
          if (~dataCheckedId.indexOf(slot.id)) {
            slotArr.push(Helper.deepCopy(slot, {}));
          }
        });
        if (slotArr.length) {
          let dataCheckedItem = Helper.deepCopy(item, {});
          dataCheckedItem.slot = slotArr;
          dataChecked.push(dataCheckedItem);
        }
      });
      if (!isReturn) {
        this.dataChecked = dataChecked;
      } else {
        return dataChecked;
      }
    },
    getChckedIds() {
      let ids = [];
      this.dataChecked.forEach((item) => {
        if (item && item.slot) {
          item.slot.forEach((slot) => {
            ids.push(slot.id);
          });
        }
      });
      return ids;
    },
    debounce(func, wait, immediate) {
      let timeout, args, context, timestamp, result;

      const later = () => {
        let last = new Date().getTime() - timestamp;

        if (last < wait && last >= 0) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) {
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          }
        }
      };
      return () => {
        context = this;
        args = arguments;
        timestamp = new Date().getTime();
        let callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
          result = func.apply(context, args);
          context = args = null;
        }

        return result;
      };
    },
    debounceFn() {},
  },
};
</script>

<style lang="stylus">
.tree-transfer-wrap {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .tree-left {
    width: 60%;
  }

  .tree-right {
    width: 40%;
  }
}
</style>
