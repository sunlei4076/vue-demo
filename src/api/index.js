import api from './axios'
// 幸运大转盘所有奖品数据
export const getAllPrizes = () => {
  return api.get('/static/database/lucky-wheel/allPrizes.json')
}
// 幸运大转盘当前中奖
export const doDraw = () => {
  return api.get('/static/database/lucky-wheel/currentPrize.json')
}
// 刮刮卡中奖
export const doScratch = () => {
  return api.get('/static/database/card-lottery/currentPrize.json')
}
// 九宫格所有奖品
export const getLatticeAllPrizes = () => {
  return api.get('/static/database/lattice-lottery/allPrizes.json')
}
// 九宫格中奖
export const getLatticeCurrentPrize = () => {
  return api.get('/static/database/lattice-lottery/currentPrize.json')
}
// 老虎机所有奖品
export const getTigerAllPrizes = () => {
  return api.get('/static/database/tiger-lottery/allPrizes.json')
}
// 老虎机当前中奖
export const getTigerCurrentPrize = () => {
  return api.get('/static/database/tiger-lottery/currentPrize.json')
}
