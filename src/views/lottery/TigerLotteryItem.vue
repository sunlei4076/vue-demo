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
