<template>
  <div>
  </div>
</template>

<script>
import Vue from 'vue'
import uuid from 'uuid'

export default {
  name: 'CustomComponent',

  props: {
    value: {
      required: true,
    },

    config: {
      required: true,
    },

    extend: {
      type: Object,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      instance: null,
      uuid: uuid(),
    }
  },

  watch: {
    config(val) {
      if (this.instance) {
        this.instance.$destroy()
        this.$el.removeChild(this.instance.$el)
      }
      this.mountComponent(val)
    },

    extend(val) {
      if (this.instance) {
        this.instance.extend = val
      }
    },
  },

  methods: {
    handleValueChange(guid, val) {
      if (guid === this.uuid) {
        this.$emit('input', val)
      }
    },

    mountComponent(config) {
      let obj = config
      if (typeof config === 'string') {
        /* eslint-disable no-new-func */
        const fn = new Function(config)
        /* eslint-enable no-new-func */
        obj = fn()
      }

      const constructor = Vue.extend(obj)

      this.instance = new constructor({
        el: this.$el,
        propsData: {
          uuid: this.uuid,
          extend: this.extend,
          disabled: this.disabled,
        },
      })
    },
  },

  mounted() {
    this.mountComponent(this.config)
    this.$bus.$on('custom-component:value', this.handleValueChange)
  },

  beforeDestroy() {
    if (this.instance) {
      this.instance.$destroy()
      this.$el.removeChild(this.instance.$el)
    }
  },
}
</script>
