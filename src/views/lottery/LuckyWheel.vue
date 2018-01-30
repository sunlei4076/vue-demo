<template>
  <div class="lucky-wheel-wrapper">
    <div class="lucky-wheel-title"></div>
    <div class="lucky-wheel">
      <div class="wheel-pointer-wrapper">
        <div class="wheel-pointer" @click="doDraw" :style="{transform: rotate_angle_pointer, transition: rotate_transition_pointer}"></div>
      </div>
      <div class="wheel-main" :style="{transform: rotate_angle, transition: rotate_transition}">
        <ul class="prize-list">
          <li class="prize-item" v-for="item of allPrizes" :key="item.id">
            <div class="prize-pic">
              <img :src="item.picture">
            </div>
            <div class="prize-count">
              {{item.change}}
            </div>
            <div class="prize-type">
              {{item.zh_name}}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getAllPrizes, doDraw } from 'api'
export default {
  name: 'LuckyWheel',
  data () {
    return {
      allPrizes: [],
      currentPrize: null,
      start_rotating_degree: 0,
      start_rotating_degree_pointer: 0, // 指针初始旋转角度
      rotate_angle_pointer: 0, // 指针将要旋转的度数
      rotate_angle: 0, // 转盘将要旋转的度数
      rotate_transition: 'transform 6s ease-in-out', // 初始化选中的过度属性控制
      rotate_transition_pointer: 'transform 6s ease-in-out', // 初始化指针过度属性控制
      isRotating: false // 是否正在旋转
    }
  },
  async created () {
    try {
      const data = await getAllPrizes()
      this.allPrizes = data
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async doDraw () {
      try {
        this.currentPrize = await doDraw()
        for (let i = 0, len = this.allPrizes.length; i < len; i++) {
          if (this.allPrizes[i].id === this.currentPrize.id) {
            this.rotate(i, 'both')
            return
          }
        }
      } catch (e) {
        console.log(e)
      }
    },
    rotate (index, type) {
      if (this.isRotating) {
        return
      }
      this.isRotating = true
      const randCircle = 10 // 附加多转几圈，2-3
      if (type === 'wheel') { // 转轮旋转
        const resultAngle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5] // 最终会旋转到下标的位置所需要的度数
        const rotateAngle = this.start_rotating_degree + randCircle * 360 + resultAngle[index] - this.start_rotating_degree % 360
        this.start_rotating_degree = rotateAngle
        this.rotate_angle = `rotate(${rotateAngle}deg)`
      } else if (type === 'pointer') { // 指针旋转
        const resultAnglePointer = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]
        const rotateAnglePointer = this.start_rotating_degree_pointer + 360 * randCircle + resultAnglePointer[index] - this.start_rotating_degree_pointer % 360
        this.start_rotating_degree_pointer = rotateAnglePointer
        this.rotate_angle_pointer = `rotate(${rotateAnglePointer}deg)`
      } else if (type === 'both') { // 一起旋转
        const resultAngle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5] // 最终会旋转到下标的位置所需要的度数
        const rotateAngle = this.start_rotating_degree + randCircle * 360 + resultAngle[index] - this.start_rotating_degree % 360
        const rotateAnglePointer = this.start_rotating_degree_pointer + randCircle * 360
        this.start_rotating_degree = rotateAngle
        this.rotate_angle = `rotate(${rotateAngle}deg)`
        this.start_rotating_degree_pointer = rotateAnglePointer
        this.rotate_angle_pointer = `rotate(${rotateAnglePointer}deg)`
      }
      setTimeout(() => {
        alert('恭喜中了10金豆')
        this.isRotating = false
      }, 7000)
    }
  }
}
</script>
<style lang="scss" scoped>
.lucky-wheel-wrapper {
  width: 100%;
  height: 100%;
  background: rgb(252, 207, 133) url("~@/assets/images/color_pillar.png") no-repeat center bottom;
  background-size: 100%;
  padding-top: 50px;
  .lucky-wheel-title {
    width: 100%;
    height: 2.3rem;
    background: url("~@/assets/images/lucky-wheel/lucky_title.png") no-repeat center top;
    background-size: 100%;
  }
  .lucky-wheel {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .wheel-pointer-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 100;
      transform: translate(-50%, -60%);
      width: 1.7rem;
      height: 1.7rem;
      .wheel-pointer {
        width: 100%;
        height: 100%;
        background: url("~@/assets/images/lucky-wheel/draw_btn.png") no-repeat center top;
        background-size: 100%;
        transform-origin: center 60%;
      }
    }
    .wheel-main {
      display: flex;
      width: 5.9rem;
      height: 5.9rem;
      background: url("~@/assets/images/lucky-wheel/draw_wheel.png") no-repeat center top;
      background-size: 100%;
      color: #fff;
      font-weight: 500;
      flex-direction: column;
      justify-content: center;
      align-content: center;
      transition: transform 3s ease;
      .prize-list {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        .prize-item {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          width: 1.88rem;
          height: 2.88rem;
          &:first-child {
            top: 0;
            left: 2.66rem;
            transform: rotate(20deg);
          }
          &:nth-child(2) {
            top: 0.896rem;
            left: 3.456rem;
            transform: rotate(67deg);
          }
          &:nth-child(3) {
            top: 2.048rem;
            left: 3.392rem;
            transform: rotate(-250deg);
          }
          &:nth-child(4) {
            top: 2.88rem;
            left: 2.628rem;
            transform: rotate(-210deg);
          }
          &:nth-child(5) {
            top: 2.948rem;
            left: 1.408rem;
            transform: rotate(-160deg);
          }
          &:nth-child(6) {
            top: 2.044rem;
            left: 0.608rem;
            transform: rotate(-111deg);
          }
          &:nth-child(7) {
            top: 0.896rem;
            left: 0.58rem;
            transform: rotate(-69deg);
          }
          &:nth-child(8) {
            top: 0;
            left: 1.44rem;
            transform: rotate(-20deg);
          }
          .prize-pic{
            text-align: center;
            img{
              width: 1.3rem;
              height: 0.8rem;
              margin-top: 0.5rem;
            }
          }
          .prize-count {
            font-size: 0.28rem;
          }
          .prize-type {
            font-size: 0.12rem;
          }
        }
      }
    }
  }
}
</style>
