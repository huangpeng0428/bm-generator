<template>
  <div class="code-editor" ref="editor">
  </div>
</template>

<script>
import * as ace from 'brace'
import 'brace/mode/javascript'
import 'brace/mode/html'
import 'brace/mode/css'
import 'brace/theme/monokai'

export default {
  name: 'CodeEditor',

  props: {
    value: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      default: 'javascript',
    },
  },

  data() {
    return {
      editor: null,
      content: '',
    }
  },

  watch: {
    value(val) {
      if (this.editor) {
        if (val !== this.content) {
          this.editor.setValue(val, -1)
        } else if (!val) {
          this.editor.setValue('')
        }
      }
    },

    mode(val) {
      if (this.editor) {
        this.editor.getSession().setMode(`ace/mode/${val}`)
      }
    },
  },

  methods: {
    handleValueChange() {
      if (this.editor) {
        this.content = this.editor.getValue()
      }
      this.$emit('input', this.content)
    },
  },

  mounted() {
    this.editor = ace.edit(this.$refs.editor)
    this.editor.setTheme('ace/theme/monokai')
    this.editor.getSession().setMode(`ace/mode/${this.mode}`)
    this.editor.$blockScrolling = Infinity
    this.editor.setValue(this.value, -1)
    this.editor.on('change', this.handleValueChange)
    window.onbeforeunload = function (e) {
      e = e || window.event;
      var tips = '确定要离开编辑页面吗？'
      if (e) {
        e.returnValue = tips
      }
      return tips
    }
  },
  beforeDestroy() {
    window.onbeforeunload = function () {}
  }
}
</script>

<style lang="stylus">
  .code-editor
    height 200px
</style>
