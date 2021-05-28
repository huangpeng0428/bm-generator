<template>
  <el-button
    v-show="src"
    type="text"
    @click="handleClick">{{ videoInfo }}</el-button>
</template>

<script>
import Vue from "vue";
import VideoViewerBox from "./VideoViewerBox";

const BoxConstructor = Vue.extend(VideoViewerBox);

export default {
  name: "VideoViewer",

  props: {
    src: {
      type: String,
      required: true,
      default: "",
    },
    videoInfo: {
      type: String,
      required: true,
      default: "",
    },
  },

  data() {
    return {};
  },

  methods: {
    handleClick() {
      const instance = new BoxConstructor({
        el: document.createElement("div"),
        propsData: {
          src: this.src,
        },
      });
      instance.$on("close", () => {
        instance.$destroy();
        document.querySelector("body").removeChild(instance.$el);
      });
      document.querySelector("body").appendChild(instance.$el);
    },
  },
};
</script>
<style scoped>
img {
  width: 100%;
}
</style>
