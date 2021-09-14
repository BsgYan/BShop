import axios from "axios";
import {Notify,Toast} from "vant";
import router from '../router';

export function request(config) {
    const instance = axios.create({
        baseURL:'https://api.shop.eduwork.cn',
        timeout:5000
    })

    //请求拦截
    instance.interceptors.request.use(config=>{
        //如果有一个接口需要认证才能访问，就在这统一设置
        const token=window.localStorage.getItem('token');
        if(token){
            // 如果token存在
            // Authorization: Bearer Token ; key : value
            // 在headers头部加上Authorization属性，把token带到服务器里面
            config.headers.Authorization = "Bearer " + token; // Bearer 右边有一个空格
        }
        //直接放行
        return config;
    },error => {

    })

    //响应拦截
    instance.interceptors.response.use(res=>{
        console.log(res);
        return res.data ? res.data : res;
    },err => {
        //如果有需要授权才可以访问的接口统一去login授权
        if(err.response.status=='401'){
            Toast.fail('请先登入');
            setTimeout(()=>{
                router.push({path:'/login'});
            },500);
        }
        //如果有错误，这里处理
        Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0]);
    })

    return instance(config);
}