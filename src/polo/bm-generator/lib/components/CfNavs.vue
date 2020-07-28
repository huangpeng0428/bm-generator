<template>
  <div class="navs-wrapper" v-if="navs.length > 0">
    <ul class="clearfix">
      <li v-for="nav in navs" :key="nav.path">
        <a href="javascript:;" v-if="nav.active" class="active">
          {{nav.text}}
        </a>
        <router-link v-else :to="{ path: nav.path }">
          {{nav.text}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CfNavs',

  props: {
    navs: {
      type: Array,
      default() {
        return []
      },
    },
  },

  data() {
    return {

    }
  },
}
</script>
