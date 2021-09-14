<template>
    <div>
        <nav-bar>
            <template v-slot:left>&lt</template>
            <template v-slot:default>用户登入</template>
        </nav-bar>
        <div style="margin-top: 50px">
            <div style="text-align: center; padding-top: 50px">
                <van-image
                        width="10rem"
                        height="5rem"
                        fit="contain"
                        :src="imgsrc"
                />
            </div>
        </div>
        <van-form @submit="onSubmit">
            <van-field
                    v-model="email"
                    name="邮箱"
                    label="邮箱"
                    placeholder="邮箱"
                    :rules="[{ required: true, message: '请填写邮箱' }]"
            />
            <van-field
                    v-model="password"
                    type="password"
                    name="密码"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"
            />

            <div style="margin: 16px">
                <div class="link-login" @click="$router.push({ path: '/register' })">
                    没有账号，立即注册
                </div>
                <van-button round block type="info" color="#44b883" native-type="submit"
                >登入</van-button
                >
            </div>
        </van-form>
    </div>

</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {ref,reactive,toRefs} from 'vue';
    import { Notify, Toast } from "vant";
    import {login} from "network/user";
    import { useRouter } from "vue-router";
    import {useStore} from 'vuex';

    export default {
        name: "Login",
        setup(){
            const router = useRouter();
            const store=useStore();
            const userinfo = reactive({
                email:'',
                password:'',
            })

            const onSubmit=()=>{
                login(userinfo).then(res=>{
                    //将token保存到本地window.storage
                    window.localStorage.setItem('token',res.access_token);
                    //在vuex isLogin
                    store.commit('setIsLogin',true);
                    Toast.success('登入成功');

                    userinfo.email='';
                    userinfo.password='';

                    setTimeout(()=>{
                        router.go(-1);
                    },500);
                })
            }

            return{
                ...toRefs(userinfo),
                imgsrc: require('assets/images/girl.jpg'),
                onSubmit
            }
        },
        components:{
            NavBar,
        }
    }
</script>

<style scoped>
    .link_login {
        font-size: 14px;
        margin-bottom: 20px;
        color: #42b983;
        display: inline-block; /**行级块 */
        text-align: left;
        float: right;
    }
</style>