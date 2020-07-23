<!--
 * @Date: 2020-07-23 16:46:57
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-23 16:47:15
-->
<template>
  <div/>
</template>

<script>
import Vue from 'vue'
import uuid from 'uuid'

export default {
  name: 'CustomComponent',

  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true
    },

    // eslint-disable-next-line vue/require-prop-types
    config: {
      required: true
    },

    // eslint-disable-next-line vue/require-default-prop
    extend: {
      type: Object
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      instance: null,
      uuid: uuid()
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
    }
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
          disabled: this.disabled
        }
      })
    }
  }
}
</script>
