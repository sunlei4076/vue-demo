<template>
  <div id="app" class="app">
    <!-- <h4 class="title">一些在工作中做的活动页面，抽取出来集合在一起</h4>
    <ul class="activity-list">
      <router-link to="/lottery" class="item" tag="li">抽奖活动</router-link>
    </ul> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/var";
.app {
  height: 100%;
  .title{
    margin-top: 50px;
    padding: 0 20px;
    font-size: 20px;
    line-height: 1.5;
    text-align: center;
  }
  .item{
    font-size: 16px;
    padding: 20px;
    color: $mainColor;
  }
}
</style>
