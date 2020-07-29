<template>
  <div class="tree-transfer-wrap">
    <div class="tree-left">
      <h3>{{ treeTransferTitle.left }}</h3>
      <!-- <el-tree
        :data="dataCheck"
        :default-expand-all="expandAllLeft"
        show-checkbox
        :render-after-expand="false"
        node-key="id"
        ref="treeLeft"
        highlight-current
        :default-checked-keys="defaultDataCheckedId"
        @check-change="handleCheckChange"
        :lazy="isLazy"
        :props="defaultProps">
      </el-tree>  -->
      <tree
        :setting="setting"
        :nodes="dataCheck"
        @onCheck="onCheck"/>
    </div>
    <div class="tree-right">
      <h3>{{ treeTransferTitle.right }}</h3>
      <tree
        :setting="checkSetting"
        :nodes="dataChecked"
        @onCreated="handleCreated"
      />
      <!-- <el-tree
        :data="dataChecked"
        default-expand-all
        ref="treeRight"
        highlight-current
        :lazy="isLazy"
        :props="defaultProps">
        <span class="custom-tree-node" slot-scope="{ node, data }">
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
      </el-tree>  -->
    </div>
  </div>
</template>

<script>
import tree from 'vue-giant-tree';
import Helper from '../../helper'

export default {
    components: {
      tree
    },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    dataCheck: Array,   // 各项传入的值
    // dataChecked: Array,
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
          left: '备选位置',
          right: '已选位置'
        }
      }
    }
  },

  data() {

    // let dataCheck = this.dataCheck
    // let dataChecked = this.getDataChecked(this.defaultDataCheckedId, true)
    // let dataCheckedId = Helper.deepCopy(this.defaultDataCheckedId, [])
    return {
      dataCheckCopy: [],    // 拷贝各项传入的值
      defaultDataCheckedIdCopy: [],   // 传入的原始选中数据
      defaultProps: {
        children: 'slot',
        label: 'name'
      },
      dataChecked: [],        // 全部已选择
      setting: {
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true,
            pIdKey: 'pid'
          }
        },
        view: {

          // showIcon: false,
          // addHoverDom: this.addHoverDom,
          // removeHoverDom: this.removeHoverDom,
        }
      },
      checkSetting: {
        check: {
          enable: false
        },
        data: {
          simpleData: {
            enable: true,
            pIdKey: 'pid'
          }
        },
        view: {
          showIcon: false,
          addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom
        }
      },
      ztreeObj: null,
      treeChecked: {}

      // dataCheckedId: dataCheckedId,
      // dataChecked: dataChecked,
    }
  },

  computed: {},

  watch: {
    dataCheck: {
      handler(val) {

        // console.log(val)
        this.dataChecked = []
        val.forEach(e => {
        if (e.checked) {
          let item = JSON.parse(JSON.stringify(e))
          item['open'] = true
          item['checked'] = false
          this.dataChecked.push(item)
        }
      })

      // console.log(this.dataChecked)
      this.dataCheckCopy = Helper.deepCopy(val, [])
      },
      deep: true
    },

    // dataCheckedId: {
    //   handler(val) {
    //     this.$emit('checkDataChang', val)
    //   },
    //   deep: true
    // },
    defaultDataCheckedId: {
      handler(val) {
        this.defaultDataCheckedIdCopy = Helper.deepCopy(val, [])

        // console.log('defaultDataCheckedId',val)
      }
    },
    defaultDataCheckedIdCopy: {
      handler(val) {
        this.$emit('checkDataChang', {checkedId: val, treeChecked: this.treeChecked})
      }
    }
  },

  mounted() {

    // console.log(this.dataCheck)
    // console.log(this.defaultDataCheckedId)
    // this.debounceFn = this.debounce(this.getDataChecked, 200)
  },

  methods: {
    onCheck(evt, treeId, treeNode) {
      console.log(treeNode)

      // 选中事件
      this.dataChecked = []
      this.defaultDataCheckedIdCopy = []      // 需要传给后台的值
      let { id, pid, name, checked } = treeNode
      console.log(id, pid, name, checked);
      this.treeChecked = treeNode
      this.dataCheckCopy.forEach(e => {
        if (e.id == id) {
          if (e.pid == '') {   // 选中的为一级选项
            // e.checked = checked
            this.dataCheckCopy.forEach(element => {
              if (element.pid == e.id) {
                element.checked = checked
              }
            })
          } else {
            e.checked = checked
          }
        }

        if (e.checked) {
          this.dataChecked.push(e)
          this.dataCheckCopy.forEach(item => {
            if (item.id == e.pid) {

              // console.log(item)
              item['open'] = true
              if (this.dataChecked.indexOf(item) === -1) this.dataChecked.push(item)
              this.dataChecked = this.dataChecked.filter((e, i, arr) => arr.indexOf(e) === i)
            }
          })

        } else {

          // console.log(this.dataChecked)
        }

      })
           let arr = []
           this.dataChecked.forEach(element => {
             this.dataChecked.forEach(item => {
               if (item.id == element.pid) {
                 arr.push(item, element)
               }
             })
           })
           this.dataChecked = arr.filter((e, i, r) => {
             if (r.indexOf(e) === i) {
               if (e.pid !== '') this.defaultDataCheckedIdCopy.push(e.id)
               return e
             }

            // return r.indexOf(e) === i
            })

            // console.log(this.dataChecked)
            // this.dataChecked.forEach(element => {
            //   if(element.pid !== '') this.defaultDataCheckedIdCopy.push(element.id)
            // })
          //  console.log(this.dataChecked)
          //  console.log(this.defaultDataCheckedIdCopy)
    },

    addHoverDom(treeid, treeNode) {
      const item = document.getElementById(`${treeNode.tId}_a`);
      if (item && !item.querySelector('.tree_extra_btn')) {
        const btn = document.createElement('sapn');
        btn.id = `${treeid}_${treeNode.id}_btn`;
        btn.classList.add('tree_extra_btn');
        btn.innerText = '删除';
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          this.clickRemove(treeNode)
        })
        item.appendChild(btn);
      }
    },

    removeHoverDom(treeid, treeNode) {

      // console.log(treeid, treeNode)
      const item = document.getElementById(`${treeNode.tId}_a`);
      if (item) {
        const btn = item.querySelector('.tree_extra_btn');
        if (btn) {
          item.removeChild(btn)
        }
      }
    },

    clickRemove(treeNode) {
      this.treeChecked = treeNode
      this.ztreeObj && this.ztreeObj.removeNode(treeNode)
      let removeidArr = []
      this.defaultDataCheckedIdCopy = []      // 需要传给后台的值
      removeidArr.push(treeNode.id)
      if (treeNode.children) {
        treeNode.children.forEach(e => {
          removeidArr.push(e.id)
        })
      }
      this.dataChecked = this.dataChecked.filter(e => {
        if (removeidArr.indexOf(e.id) === -1) {
          if (e.pid !== '') this.defaultDataCheckedIdCopy.push(e.id)
          return e
        }
      })
    },

    handleCreated: function(ztreeObj) {
      this.ztreeObj = ztreeObj;

      // onCreated 中操作ztreeObj对象展开第一个节点
      ztreeObj.expandNode(ztreeObj.getNodes()[0], true);
    }
  }
}
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
  .tree_extra_btn{
    display: inline-block;
    padding: 0 3px;
    color: red;
  }
}
</style>
