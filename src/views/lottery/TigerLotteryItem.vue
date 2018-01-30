<template>
  <div class="item">
    <ul class="roller" ref="roller">
      <li v-for="item of prizeList" :key="item.id"><img :src="item.picture" alt=""></li>
    </ul>
    </div>
</template>
<script>
import {animationEnd} from '@/util'
export default {
  name: 'TigerLotteryItem',
  props: {
    prizeList: {
      type: Array
    }
  },
  data () {
    return {
      elem: null,
      height: 0,
      index: -1,
      state: 0,
      items: []
    }
  },
  mounted () {
    this.elem = this.$refs.roller
    this.items = this.elem.children
    setTimeout(() => {
      this.elem.appendChild(this.items[0].cloneNode(true))
    }, 20)
  },
  methods: {
    resize () {
      this.height = this.items[0].clientHeight
      if (!this.elem.classList.contains('fx-roll') && this.index > 0) this.elem.style.marginTop = -this.index * this.height + 'px'
    },
    reset () {
      this.elem.classList.remove('fx-roll')
      this.elem.classList.remove('fx-bounce')
      this.elem.style.marginTop = 0
      this.state = 0
    },
    start (timeout = 0) {
      if (this.state === 1) return
      this.state = 1
      setTimeout(() => {
        if (this.state !== 1) return
        this.elem.classList.add('fx-roll')
        this.elem.style.marginTop = 0
      }, timeout)
    },
    stop (index, callback, timeout = 0) {
      if (!this.height) this.height = this.items[0].clientHeight
      setTimeout(() => {
        if (this.state !== 1) return
        this.elem.classList.remove('fx-roll')
        this.elem.classList.add('fx-bounce')
        this.elem.style.marginTop = -index * this.height + 'px'
        animationEnd(this.elem, () => {
          this.state = 0
          this.elem.classList.remove('fx-bounce')
          if (callback) callback.call(this, index)
        })
      }, timeout)
    }
  }
}
</script>
<style lang="scss" scoped>
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
  .roller{
    position: relative;
    &.fx-roll{
      filter: blur(3px);
      animation: fx-roll 0.5s 0s infinite linear;
    }
    &.fx-bounce{
      animation-duration: 0.3s;
    }
    li{
      width: 1.25rem;
      height: 1.56rem;
      text-align: center;
      overflow: hidden;
      &:last-child{
        position: absolute;
        top: 100%;
        left: 0;
      }
      img{
        height: 100%;
      }
    }
  }
}
@keyframes fx-roll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(0, -100%, 0);
  }
}
</style>
