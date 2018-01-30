<template>
  <div class="lattice-lottery-wrapper">
    <div class="lattice-lottery" ref="latticeLottery">
      <div class="row">
        <div class="col" v-for="(item, idx) of row1List" :key="item.id" :class="{active: index === idx}">
          <img :src="item.picture" alt="">
          <div class="mask"></div>
        </div>
      </div>
      <div class="row">
        <div class="col" :class="{active: index === 7}">
          <img :src="lastItem.picture" alt="">
          <div class="mask"></div>
        </div>
        <div class="btn" @click="doDraw"><img src="~@/assets/images/lattice-lottery/draw-btn.jpg" alt=""></div>
        <div class="col" :class="{active: index === 3}">
           <img :src="item4.picture" alt="">
           <div class="mask"></div>
        </div>
      </div>
      <div class="row">
       <div class="col" v-for="(item, idx) of row2List" :key="item.id" :class="{active: index === (6 - idx)}">
          <img :src="item.picture" alt="">
          <div class="mask"></div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="lottery-modal-wrapper" v-if="showModal">
        <div class="lottery-modal">
          <h2 class="title">恭喜你，获得</h2>
          <p class="text">{{currentPrize.name}}</p>
          <button class="close-btn" @click="reset">再来一次</button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import {getLatticeAllPrizes, getLatticeCurrentPrize} from 'api'
export default {
  name: 'LatticeLottery',
  data () {
    return {
      allPrizes: [],
      row1List: [],
      row2List: [],
      item4: {},
      lastItem: {},
      showModal: false,
      isRotating: false,
      currentPrize: {},
      index: -1, // 当前转动到哪个位置，起点位置
      count: 8, // 总共有多少个位置
      timer: 0, // setTimeout的ID，用clearTimeout清除
      speed: 200, // 初始转动速度
      times: 0, // 转动次数
      cycle: 50, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1 // 中奖位置
    }
  },
  created () {
    this.getAllPrizes()
  },
  methods: {
    async getAllPrizes () {
      try {
        const data = await getLatticeAllPrizes()
        this.allPrizes = data
        this.row1List = data.slice(0, 3)
        this.item4 = data.slice(3, 4)[0]
        this.row2List = data.slice(4, 7).reverse()
        this.lastItem = data.slice(7)[0]
      } catch (e) {
        console.log(e)
      }
    },
    async doDraw () {
      if (this.isRotating) return
      try {
        this.isRotating = true
        this.speed = 200
        this.currentPrize = await getLatticeCurrentPrize()
        for (let i = 0, len = this.allPrizes.length; i < len; i++) {
          let prize = this.allPrizes[i]
          if (prize.id === this.currentPrize.id) {
            this.prize = i
            break
          }
        }
        this.roll()
      } catch (e) {
        console.log(e)
      }
    },
    rotate () {
      let index = this.index // 当前转动到哪个位置
      const count = this.count // 总共有多少个位置
      index += 1
      if (index > count - 1) {
        index = 0
      }
      this.index = index
    },
    roll () {
      this.times += 1
      this.rotate()
      // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
      if (this.times > this.cycle + 10 && this.prize === this.index) {
        clearTimeout(this.timer) // 清除转动定时器，停止转动
        this.prize = -1
        this.times = 0
        this.isRotating = true
        this.showModal = true
      } else {
        if (this.times < this.cycle) {
          this.speed -= 10 // 加快转动速度
        } else if (this.times > this.cycle + 10 &&
          ((this.prize === 0 && this.index === 7) || this.prize === this.index + 1)) {
          this.speed += 110
        } else {
          this.speed += 20
        }

        if (this.speed < 40) {
          this.speed = 40
        }
        this.timer = setTimeout(this.roll, this.speed)
      }
    },
    reset () {
      this.index = -1
      this.prize = -1
      this.times = 0
      this.isRotating = false
      this.showModal = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .lattice-lottery-wrapper{
    height: 100%;
    background: rgb(252, 207, 133) url("~@/assets/images/color_pillar.png") no-repeat center bottom;
    background-size: 100%;
    padding-top: 1rem;
    .lattice-lottery{
      width: 5.7rem;
      height: 5.1rem;
      margin: 0 auto;
      border: 0.08rem solid #ba1809;
      .row{
        display: flex;
        align-items: center;
        height: calc(100% / 3);
        border-bottom: 0.08rem solid #ba1809;
        &:last-child{
          border-bottom: 0;
        }
        .btn{
          flex: 1;
          height: 100%;
          border-right: 0.08rem solid #ba1809;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .col{
          position: relative;
          flex: 1;
          height: 100%;
          border-right: 0.08rem solid #ba1809;
          &.active{
            .mask{
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(252,211,4,0.5);
            }
          }
          &:last-child{
            border-right: 0;
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .lottery-modal-wrapper{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 101;
      .lottery-modal{
        position: absolute;
        top: 50%;
        left: 50%;
        width: 4rem;
        height: 3rem;
        padding: 0.4rem;
        transform: translate(-50%, -50%);
        border-radius: 0.08rem;
        background-color: #fff;
        z-index: 102;
        text-align: center;
        .title{
          font-size: 18px;
          color: red;
          margin-bottom: 0.4rem;
        }
        .text{
          font-size: 16px;
          color: #333;
          margin-bottom: 0.4rem;
        }
        .close-btn{
          width: 2rem;
          height: 0.8rem;
          background-color: #ec6757;
          border-radius: 0.4rem;
          color: #fff;
          outline: none;
          border: none;
        }
      }
    }
    .fade-enter, .fade-leave-active{
      opacity: 0;
    }
    .fade-enter-active, .fade-leave{
      opacity: 1;
      transition: opacity 0.2s ease-in;
    }
  }
</style>
