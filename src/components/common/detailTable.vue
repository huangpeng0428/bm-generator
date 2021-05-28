<template>
  <div class="detail-table-wrap">
    <el-form
      v-for="(group, k) in detail"
      :key="k"
      label-position="left"
      inline
      class="detail-table">
      <div
        v-if="group.title"
        class="table-title">{{ group.title }}</div>
      <div
        v-for="(row, idx) in group.rows"
        :key="idx">
        <div>
          <el-form-item
            v-for="(item, index) in row"
            v-if="!item.hide"
            :key="index"
            :class="getClass(row.length, idx)"
            :label="item.label">
            <image-viewer
              v-if="item.type == 'img' && item.value"
              :src="item.value"/>
            <video-viewer
              v-if="item.type == 'video' && item.value"
              :video-info="item.value"
              :src="item.value"/>
            <div v-if="item.type == 'imgs' && item.value">
              <image-viewer
                v-for="img in item.value"
                :key="img"
                :src="img"/>
            </div>
            <div
              v-if="item.type == 'pushIcon' && item.value"
              :class="[item.value, 'push-icon']"/>
            <div
              v-if="!item.type"
              v-html="item.value"/>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script >
export default {
  name: "DetailTable",

  props: {
    detail: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  mounted() {},

  methods: {
    getClass(len, idx) {
      if (len == 1) {
        return "item-block";
      } else if (len == 2) {
        return idx == 0 ? "item-left" : "item-right";
      }
    },
  },
};
</script>

<style lang="stylus">
.detail-table-wrap {
  .detail-table {
    font-size: 0;
    border: 1px solid #eee;

    .table-title {
      font-size: 15px;
      font-weight: bold;
      text-align: center;
      border-bottom: 1px solid #eee;
      line-height: 36px;
      background: #dedede;
    }

    label {
      width: 150px;
      font-weight: bold;
      background: #f4f4f4;
    }

    .el-form-item__label {
      text-align: right;
    }

    .el-form-item__content {
      div {
        max-width: 700px;
        padding-left: 10px;
      }
    }

    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      border-bottom: 1px solid #eee;

      img {
        width: 150px;
        height: 150px;
        margin: 10px;
      }
    }

    .item-left {
      width: 50%;
      border-right: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }

    .item-right {
      width: 50%;
      border-bottom: 1px solid #eee;
    }

    .item-block {
      display: flex;
      justify-content: flex-start;
    }

    .push-icon {
      display: inline-block;
      vertical-align: middle;
      width: 30px;
      height: 25px;
      margin-left: 20px;
      background-repeat: no-repeat;
    }
  }
}
</style>
