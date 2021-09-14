const mutations={
    setIsLogin(state,payload){
        state.user.isLogin=payload;
    },
    // 添加购物车数量的方法
    addCart(state, payload) {
        // 传递一个数量count
        state.cartCount = payload.count
    }
}

export default mutations;