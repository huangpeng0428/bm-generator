<template>
  <div :class="['upload-wrapper', disabled ? 'disabled' : '']">
    <el-upload
      :name="config.name"
      :show-file-list="false"
      :action="config.action"
      :with-credentials="config.withCredentials"
      :on-success="uploadSuccess"
      :before-upload="config.beforeUpload"
      :disabled="disabled">
      <template v-if="url">
        <img :src="url" :class="{'img-err': imgIsLoadError}" v-if="checkIsImageUrl(url)" @error="imgLoadError">
        <span v-else>{{file ? file.name : ''}}</span>
      </template>
      <i v-else class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import expose from '../expose'
import Config from '../config'

export default {
  name: 'CfUpload',

  props: {
    value: {
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
    const config = this.getConfig(this.entry.options)
    return {
      url: '',
      config,
      imgIsLoadError: false,
      file: null
    }
  },

  watch: {
    value(value) {
      this.url = this.config.getImageSrc(value)
    },
    'entry.options'(options) {
      this.config = this.getConfig(options)
    },
  },

  methods: {
    uploadSuccess(res, file) {
      this.file = file
      const result = this.config.uploadSuccess(res)
      if (result.type === 'success') {
        this.$emit('input', result.value)
      } else {
        this.$message(result)
      }
    },

    getConfig(options) {
      const config = {}

      Object.keys(options).forEach((name) => {
        config[name] = options[name] === '' ? Config.upload[name] : options[name]
        if (name === 'beforeUpload' && options[name]) {
          config[name] = new Function('file', options[name])
        }
      })
      config.action = expose.HOST + config.action

      return this.$util.assign({}, Config.upload, config)
    },

    imgLoadError() {
      this.imgIsLoadError = true
    },

    checkIsImageUrl(url) {
      return url.match(/\.(jpeg|jpg|gif|png)$/) != null
    },
  },

  mounted() {
    this.url = this.config.getImageSrc(this.value)
  },
}
</script>

<style lang="stylus">
  .upload-wrapper
    &.disabled
      .el-upload
        border 1px solid #d1dbe5
        background #eef1f6
        cursor default
        &:hover
          border-color #d1dbe5
    .el-upload
      display flex
      width 160px
      height 160px
      align-items center
      justify-content center
      border 1px dashed #d9d9d9
      border-radius 6px
      cursor pointer
      position relative
      overflow hidden
      transition border-color .5s
      &:hover
        border-color #20a0ff
        .el-icon-plus
          color #20a0ff
    img
      max-width 160px
      max-height 160px
    .img-err
      width 100px
      height 100px
      background-color #c0c0c0
    .el-icon-plus
      font-size 28px
      color #8c939d
      width 160px
      height 160px
      line-height 160px
      text-align center
      transition color .5s
</style>
