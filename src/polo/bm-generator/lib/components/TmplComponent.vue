<script>
import Vue from 'vue'

export default {
  name: 'TmplComponent',

  props: {
    value: {
      type: Object,
    },

    template: {
      type: String,
      default: '<div></div>',
    },

    data: {
      type: Object,
      default() {
        return {}
      },
    },

    props: {
      type: Array,
      default: [],
    },

    css: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      dynamic: {},
      styleTag: null,
    }
  },

  watch: {
    props(props, oldProps) {
      oldProps.forEach((prop) => {
        this.$delete(this.dynamic, prop.name)
      })
      props.forEach((prop) => {
        this.$set(this.dynamic, prop.name, prop.value)
      })
    },

    css(val) {
      this.setCss(val)
    },
  },

  methods: {
    setCss(val) {
      if (this.styleTag.styleSheet) {
        this.styleTag.styleSheet.cssText = val
      } else {
        this.styleTag.appendChild(document.createTextNode(val))
      }
    },

    getDynamicValue() {
      return Object.assign({}, this.dynamic)
    },
  },

  render(h) {
    return Vue.compile(this.template).render.call(this, h)
  },

  mounted() {
    this.props.forEach((prop) => {
      this.$set(this.dynamic, prop.name, prop.value)
    })

    this.styleTag = document.createElement('style')
    this.styleTag.type = 'text/css'
    this.setCss(this.css)
    document.querySelector('head').appendChild(this.styleTag)
  },

  beforeDestroy() {
    document.querySelector('head').removeChild(this.styleTag)
  },
}
</script>
