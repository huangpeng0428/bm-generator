<template>
  <el-autocomplete
    v-model="model"
    :popper-class="popperClass"
    :placeholder="placeholder"
    :fetch-suggestions="query"
    :disabled="disabled"
    custom-item="cf-autocomplete-item"
    @select="handleSelect"/>
</template>

<script>
import request from "../request";
import Helper from "../helper";

export default {
  name: "CfAutocomplete",

  props: {
    value: {
      type: String,
      required: true,
    },

    entry: {
      type: Object,
      required: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    placeholder: {
      type: String,
      default: "",
    },

    popperClass: {
      type: String,
      default: "cf-autocomplete",
    },
  },

  data() {
    return {
      model: "",
    };
  },

  watch: {
    model(val) {
      if (val !== this.value) {
        this.$emit("input", val);
      }
    },

    value(val) {
      if (val !== this.model) {
        this.model = val;
      }
    },
  },

  methods: {
    query(query, cb) {
      if (query) {
        const params = {
          [this.entry.options.param]: query,
        };

        request({
          url: this.entry.options.url,
          method: this.entry.options.method,
          params,
        }).then((res) => {
          Helper.handleResponse(
            res,
            () => {
              let result = [];
              if (this.entry.options.filter) {
                /* eslint-disable no-new-func */
                const fn = new Function("res", this.entry.options.filter);
                /* eslint-enable no-new-func */
                result = fn(res);
              } else {
                result = res;
              }
              cb(result);
            },
            () => {
              this.$message({
                type: "error",
                message: res.message || "获取数据出现异常",
              });
              cb([]);
            }
          );
        });
      } else {
        cb([]);
      }
    },

    handleSelect(item) {
      if (this.entry.options.refProp) {
        this.$emit("refValueChange", item[this.entry.options.refProp]);
      } else {
        this.$emit("refValueChange", item.value);
      }
    },
  },
};
</script>

<style lang="stylus">
.cf-autocomplete {
  li {
    line-height: 1.5;

    div {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    span {
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}
</style>
