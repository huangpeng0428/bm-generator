<template>
  <img class="image-viewer" :src="this.thumbnail || this.src" @click="handleClick" />
</template>

<script>
import Vue from 'vue'
import ImageViewerBox from './ImageViewerBox'

const BoxConstructor = Vue.extend(ImageViewerBox)

export default {
  name: 'ImageViewer',

  props: {
    src: {
      type: String,
      required: true,
      default: '',
    },

    thumbnail: {
      type: String,
    },
  },

  data() {
    return {
    }
  },

  methods: {
    handleClick() {
      const instance = new BoxConstructor({
        el: document.createElement('div'),
        propsData: {
          src: this.src,
        },
      })
      instance.$on('close', () => {
        instance.$destroy()
        document.querySelector('body').removeChild(instance.$el)
      })
      document.querySelector('body').appendChild(instance.$el)
    },
  },
}
</script>
<style scoped>
  img {
    width: 100%;
  }
</style>
