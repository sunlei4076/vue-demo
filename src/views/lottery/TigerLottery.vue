<template>
  <div class="tiger-lottery-wrapper">
    <div class="tiger-lottery">
      <tiger-lottery-item :prizeList="allPrizes" v-for="n in 3" :key="n" ref="rollers"/>
      <button class="toggle" @click="doDraw"></button>
    </div>
  </div>
</template>
<script>
import {getTigerAllPrizes, getTigerCurrentPrize} from 'api'
import TigerLotteryItem from './TigerLotteryItem'
export default {
  name: 'TigerLottery',
  data () {
    return {
      allPrizes: [],
      currentPrize: {},
      rollerQueue: [],
      interval: 300, // 每个roller间动画间隔
      aniMinTime: 6000, // 动画执行最少时间
      resize: true, // roller大小是否是可变的
      isDrawing: false
    }
  },
  created () {
    this.getAllPrizes()
  },
  mounted () {
    this.rollerQueue = this.$refs.rollers
  },
  methods: {
    async getAllPrizes () {
      try {
        this.allPrizes = await getTigerAllPrizes()
      } catch (e) {
        console.log(e)
      }
    },
    async doDraw () {
      if (this.isDrawing) return
      try {
        this.currentPrize = await getTigerCurrentPrize()
        this._startTime = (new Date()).getTime()
        this.isDrawing = true
        let index
        for (let i = 0, len = this.allPrizes.length; i < len; i++) {
          let prize = this.allPrizes[i]
          if (prize.id === this.currentPrize.id) {
            index = i
            break
          }
        }
        this.setResult([index, index, index])
        for (let i = 0, l = this.rollerQueue.length; i < l; i++) {
          this.rollerQueue[i].start(i * this.interval)
        }
      } catch (e) {
        console.log(e)
      }
    },
    reset () {
      this.isDrawing = false
      for (let i = 0, l = this.rollerQueue.length; i < l; i++) {
        this.rollerQueue[i].reset()
      }
    },
    setResult (ret) {
      // 保证动画执行时间
      const endTime = (new Date()).getTime()
      setTimeout(() => {
        for (let i = 0, l = this.rollerQueue.length; i < l; i++) {
          this.rollerQueue[i].stop(ret[i], (i === l - 1 ? () => {
            this.isDrawing = false
          } : null), i * this.interval)
        }
      }, endTime - this._startTime > this.aniMinTime ? 0 : this.aniMinTime - (endTime - this._startTime))
    }
  },
  components: {
    TigerLotteryItem
  }
}
</script>
<style lang="scss" scoped>
  .tiger-lottery-wrapper{
    height: 100%;
    background: rgb(252, 207, 133) url("~@/assets/images/color_pillar.png") no-repeat center bottom;
    background-size: 100%;
    padding-top: 1rem;
    .tiger-lottery{
      position: relative;
      width: 100%;
      height: 4.32rem;
      margin: 0.4rem auto;
      background: url("~@/assets/images/tiger-lottery/tiger_bg.png") no-repeat;
      background-size: 100%;
      .item{
        position: absolute;
        display: block;
        top: 0.9rem;
        left: 1.65rem;
        width: 1.25rem;
        height: 1.56rem;
        overflow: hidden;
        &:nth-child(2) {
          left: 3.125rem;
        }
        &:nth-child(3) {
          left: 4.6rem;
        }
      }
      .toggle{
        position: absolute;
        display: block;
        bottom: 0.18rem;
        left: 1.4rem;
        width: 4.71rem;
        height: 0.6rem;
        border-radius: 0.08rem;
        background-color: transparent;
      }
    }
  }
  .fx-bounce {
    animation-name: bounce;
    transform-origin: center bottom
  }
@keyframes fx-roll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -100%, 0);
  }
}
@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
     animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
     transform: translate3d(0, 0, 0);
    }
    40%, 43% {
     animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
     transform: translate3d(0, -30px, 0);
    }
    70% {
     animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
     transform: translate3d(0, -15px, 0);
    }
    90% {
      transform: translate3d(0, -4px, 0);
    }
}

</style>
