import Vue from 'vue'
import Router from 'vue-router'
import Lottery from '@/views/lottery/Lottery'
import LuckyWheel from '@/views/lottery/LuckyWheel'
import CardLottery from '@/views/lottery/CardLottery'
import LatticeLottery from '@/views/lottery/LatticeLottery'
import TigerLottery from '@/views/lottery/TigerLottery'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Lottery
    },
    {
      path: '/lottery',
      name: 'Lottery',
      component: Lottery
    },
    {
      path: '/lottery/luckyWheel',
      name: 'LuckyWheel',
      component: LuckyWheel
    },
    {
      path: '/lottery/cardLottery',
      name: 'CardLottery',
      component: CardLottery
    },
    {
      path: '/lottery/latticeLottery',
      name: 'LatticeLottery',
      component: LatticeLottery
    },
    {
      path: '/lottery/tigerLottery',
      name: 'TigerLottery',
      component: TigerLottery
    }
  ]
})
