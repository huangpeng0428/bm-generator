<template>
  <div class="container">
    <div class="header">
      {{ title }}
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      title: '首页'
    }
  }
};
</script>
<style lang="scss">
.container{
  .header{
    color: red;
  }
}
</style>
