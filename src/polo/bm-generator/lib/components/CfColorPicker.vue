<template lang="html">
  <div class="cf-color-picker">
    <el-color-picker
      v-model="color"
      @change="changeColor"/>
    <b>{{ color }}</b>
  </div>
</template>

<script>
export default {
  name: "CfColorPicker",

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
  },

  data() {
    return {
      color: this.value,
    };
  },

  methods: {
    changeColor(val) {
      console.log(2222, val);
      this.$emit("input", val);
    },
  },
};
</script>

<style lang="stylus">
.cf-color-picker {
  b {
    font-weight: normal;
    margin-left: 10px;
    display: inline-block;
    vertical-align: top;
  }
}
</style>
