<template>
  <a v-if="btn.type == 'link'" :href="link" :target="btn.options.target" :class="['el-button', 'el-button--' + btn.klass]">
    <slot>
      {{btn.text}}
    </slot>
  </a>
  <router-link v-else-if="btn.type == 'router'" :to="routerLink"
    :class="['el-button', 'el-button--' + btn.klass]">
    <slot>
      {{btn.text}}
    </slot>
  </router-link>
  <el-button v-else
    :type="btn.klass"
    @click="handleClick">
    <slot>
      {{btn.text}}
    </slot>
  </el-button>
</template>

<script>
import Tmpl from 'coffee-tmpl'
import Helper from '../helper'

export default {
  name: 'CfButton',

  props: {
    btn: {
      type: Object,
      required: true,
    },

    data: {
      required: false,
      default() {
        return {}
      },
    },
  },

  data() {
    return {
    }
  },

  computed: {
    link() {
      return Tmpl.parse(this.btn.options.path, {
        props: this.data,
      })
    },

    routerLink() {
      const link = {}
      if (this.btn.options.name) {
        link.name = this.btn.options.name
        // 同时支持params, query
        if(this.btn.options.queryParams) {
          link.query = Helper.makeParams(this.btn.options.queryParams, this.data)
        }
        if(this.btn.options.paramsParams) {
          link.params = Helper.makeParams(this.btn.options.paramsParams, this.data)
        }
      } else {
        link.path = this.btn.options.path
      }
      return link
    }
  },

  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    },
  },
}
</script>
