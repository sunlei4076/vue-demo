<template>
  <div class="card-lottery-wrapper">
    <canvas id="card-lottery" class="card-lottery" ref="cardLottery"></canvas>
    <button class="rest-btn" @click="reset">再来一次</button>
  </div>
</template>
<script>
import { doScratch } from 'api'
export default {
  name: 'CardLottery',
  data () {
    return {
      canvas: null,
      ctx: null,
      first: true,
      touch: false,
      size: 20, // 滑动区域大小
      percent: 100, // 激活百分比 到该值就显示结果
      resize: true, // canvas大小是否是可变的
      state: '',
      currentPrize: null
    }
  },
  created () {
    this.doScratch()
  },
  mounted () {
    this.canvas = this.$refs.cardLottery
    this.ctx = this.canvas.getContext('2d')
    this.init()
    this.bind()
  },
  methods: {
    async doScratch () {
      try {
        this.currentPrize = await doScratch()
        this.imgLoad()
      } catch (e) {
        console.log(e)
      }
    },
    getCanvasInfo () {
      const info = this.canvas.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeftp || 0
      this.width = info.width
      this.height = info.height
      this.offsetX = Math.round(info.left + scrollLeft)
      this.offsetY = Math.round(info.top + scrollTop)
      this.canvas.width = info.width
      this.canvas.height = info.height
    },
    init () {
      this.state = 'init'
      this.getCanvasInfo()
      // 绘制遮罩层
      this.ctx.closePath()
      this.ctx.globalCompositeOperation = 'source-over'
      const cover = this.cover
      if (cover instanceof Image) {
        this.ctx.fillStyle = this.ctx.createPattern(cover, 'repeat')
        this.ctx.rect(0, 0, this.width, this.height)
      } else {
        this.ctx.fillStyle = typeof cover === 'string' ? cover : 'gray'
        this.ctx.fillRect(0, 0, this.width, this.height)
      }
      this.ctx.fill()
      this.ctx.globalCompositeOperation = 'destination-out'
    },
    bind () {
      const SUPPORT_ONLY_TOUCH = ('ontouchstart' in window) && /mobile|tablet|ip(ad|hone|od)|android/i.test(navigator.userAgent) // 是否支持touch
      this.canvas.addEventListener(SUPPORT_ONLY_TOUCH ? 'touchstart' : 'mousedown', this.touchStart.bind(this), false)
      this.canvas.addEventListener(SUPPORT_ONLY_TOUCH ? 'touchmove' : 'mousemove', this.touchMove.bind(this), false)
      document.addEventListener(SUPPORT_ONLY_TOUCH ? 'touchend' : 'mouseup', this.touchEnd.bind(this))
      window.addEventListener('onorientationchange' in document ? 'orientationchange' : 'resize', this.onResize.bind(this))
    },
    imgLoad () {
      let img = new Image()
      img.src = this.currentPrize.picture
      img.addEventListener('load', () => {
        this.$on('start', () => {
          this.setResult(img.src)
        })
      })
    },
    reset () {
      this.first = true
      this.touch = false
      this.canvas.style.backgroundImage = null
      this.init()
      this.doScratch()
    },
    setResult (url) {
      this.canvas.style.backgroundImage = 'url(' + url + ')' // 设置结果
      this.canvas.style.backgroundSize = '100%'
    },
    draw () {
      if (this.state === 'end') return
      this.state = 'end'
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.$emit('end')
    },
    scratchPercent () {
      const imageData = this.ctx.getImageData(0, 0, this.width, this.height)
      let hits = 0
      for (let i = 0, len = imageData.data.length; i < len; i = i + 4) {
        if (imageData.data[i] === 0 && imageData.data[i + 1] === 0 && imageData.data[i + 2] === 0 && imageData.data[i + 3] === 0) {
          hits++
        }
      }
      return (hits / (this.width * this.height)) * 100
    },
    getEventXY (e) {
      e = e.changedTouches ? e.changedTouches[0] : e
      return {
        x: e.pageX - this.offsetX,
        y: e.pageY - this.offsetY
      }
    },
    touchStart (e) {
      e.preventDefault()
      if (this.state === 'end') return
      this.$emit('start')
      // 绘制起点
      const point = this.getEventXY(e)
      this.state = 'start'
      this.touch = true
      this.first = false
      this.ctx.beginPath()
      this.ctx.arc(point.x, point.y, this.size / 2, 0, Math.PI * 2, true)
      this.ctx.closePath()
      this.ctx.fill()
      this.ctx.beginPath()
      this.ctx.lineWidth = this.size
      this.ctx.moveTo(point.x, point.y)
    },
    touchMove (e) {
      e.preventDefault()
      if (!this.touch) return
      // 绘制路线
      const point = this.getEventXY(e)
      this.ctx.lineTo(point.x, point.y)
      this.ctx.stroke()
    },
    touchEnd (e) {
      if (!this.touch) return
      this.touch = false
      // 绘制终点
      const point = this.getEventXY(e)
      this.ctx.closePath()
      this.ctx.beginPath()
      this.ctx.arc(point.x, point.y, this.size / 2, 0, Math.PI * 2, true)
      this.ctx.closePath()
      this.ctx.fill()
      // 计算已经刮掉的面积
      if (this.scratchPercent() >= this.percent) {
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.state = 'end'
        this.$emit('end')
      }
    },
    onResize () {
      this.touch = false
      if (this.resize) {
        if (this.state !== 'end') {
          this.init()
        } else {
          this.getCanvasInfo()
        }
      } else {
        this.getCanvasInfo()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/style/var';
.card-lottery-wrapper{
  width: 100%;
  height: 100%;
  background: rgb(252, 207, 133) url("~@/assets/images/color_pillar.png") no-repeat center bottom;
  background-size: 100%;
  padding-top: 50px;
  text-align: center;
   .card-lottery{
    display: block;
    width: 4rem;
    height: 2rem;
    margin: 0.4rem auto 0;
  }
  .rest-btn{
    margin-top: 0.2rem;
    width: 3rem;
    height: 0.8rem;
    background-color: $mainColor;
    color: #fff;
    font-size: 16px;
    border-radius: 0.08rem;
    border: none;
  }
}
</style>
