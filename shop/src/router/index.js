import { createRouter, createWebHistory } from 'vue-router'
const Home=()=>import('../views/home/Home');
const Category=()=>import('../views/category/Category');
const Detail=()=>import('../views/detail/Detail');
const Profile=()=>import('../views/profile/Profile');
const ShopCart=()=>import('../views/shopcart/ShopCart');
const Register=()=>import('../views/profile/Register');
const Login=()=>import('../views/profile/Login');
const Address=()=>import('../views/profile/Address');
const AddressEdit=()=>import('../views/profile/AddressEdit');
const CreateOrder=()=>import('../views/order/CreateOrder');
const Order=()=>import('../views/order/Order');
const OrderDetail=()=>import('../views/order/OrderDetail');
import {Notify} from "vant";
import store from '../store';

const routes = [
  {
    path: '',
    name: 'DefaultHome',
    component: Home,
    meta:{
      title:'图书商城'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta:{
      title:'图书商城'
    }
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
    meta:{
      title:'商品分类'
    }
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail,
    meta:{
      title:'商品详情'
    }
  },
  {
    path: '/shopcart',
    name: 'ShopCart',
    component: ShopCart,
    meta:{
      title:'购物车',
      isAuthRequired:true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta:{
      title:'个人中心',
      isAuthRequired:true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta:{
      title:'用户注册'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta:{
      title:'用户登入'
    }
  },
  {
    path: "/address",
    name: "Address",
    component: Address,
    meta: {
      title: "地址管理",
    },
  },
  {
    path: "/addressedit",
    name: "AddressEdit",
    component: AddressEdit,
    meta: {
      title: "地址编辑",
    }
  },
  {
    path: "/createorder",
    name: "CreateOrder",
    component:CreateOrder,
    meta: {
      title: "订单详情",
    },
  },
  {
    path: "/order",
    name: "Order",
    component: Order,
    meta: {
      title: "订单详情",
    },
  },
  {
    path: "/orderdetail",
    name: "OrderDetail",
    component: OrderDetail,
    meta: {
      title: "订单详情",
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next)=>{
  //如果没有登入，在这里到login
  if(to.meta.isAuthRequired && store.state.user.isLogin===false){
    Notify('您还没有登入，请先登入');
    return next('/login');
  }else{
    next();
  }
  document.title=to.meta.title;
})

export default router
