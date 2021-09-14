import { createStore } from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

const state={
  user:{
    isLogin:window.localStorage.getItem('token') ? true : false
  },
  // 状态管理保存用户购物车的数量
  cartCount: 0, // 购物车数量
}

export default createStore({
  state,
  mutations,
  actions,
  getters
})
