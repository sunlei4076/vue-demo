<template>
  <div class="lottery-wrapper">
    <p class="text">
       接近年关，各式各样的抽奖活动也是层出不穷，在这里我总结了4种常见的抽奖方式。分别是：
    </p>
      <ul class="lottery-list">
        <router-link to="/lottery/luckyWheel" class="link" tag="li">幸运大转盘</router-link>
        <router-link to="/lottery/latticeLottery" class="link" tag="li">九宫格转盘</router-link>
        <router-link to="/lottery/tigerLottery" class="link" tag="li">老虎机</router-link>
        <router-link to="/lottery/cardLottery" class="link" tag="li">刮刮卡</router-link>
      </ul>
  </div>
</template>
<script>
</script>
<style lang="scss" scoped>
@import "~@/assets/style/var";
  .lottery-wrapper{
    padding: 20px;
    .text{
      font-size: 18px;
      line-height: 1.4;
    }
    .lottery-list{
      display: flex;
      align-items: center;
      margin-top: 30px;
      .link{
        display: block;
        margin-right: 20px;
        color: $mainColor;
      }
    }
  }
</style>
