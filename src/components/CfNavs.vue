<!--
 * @Date: 2020-07-23 16:30:27
 * @LastEditors: PoloHuang
 * @LastEditTime: 2020-07-23 16:30:35
-->
<template>
  <div
    v-if="navs.length > 0"
    class="navs-wrapper">
    <ul class="clearfix">
      <li
        v-for="nav in navs"
        :key="nav.path">
        <a
          v-if="nav.active"
          href="javascript:;"
          class="active">
          {{ nav.text }}
        </a>
        <router-link
          v-else
          :to="{ path: nav.path }">
          {{ nav.text }}
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
      }
    }
  },

  data() {
    return {

    }
  }
}
</script>
