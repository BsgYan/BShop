<template>
    <div id="home">
        <nav-bar>
            <template v-slot:left>&lt</template>
            <template v-slot:default>图书商城</template>
        </nav-bar>
        <tab-control v-show="isTabFixed" @tabClick="tabClick" :titles="['畅销','新书','精选']"></tab-control>
        <div class="wrapper">
            <div class="content">
                <div ref="banref">
                    <div class="banners">
                        <home-swiper :banners="banners"></home-swiper>
                    </div>
                    <recommend-view :recommends="recommends"></recommend-view>
                </div>
                <tab-control @tabClick="tabClick" :titles="['畅销','新书','精选']"></tab-control>

                <goods-list :goods="showGoods"></goods-list>

            </div>
        </div>

        <back-top @bTop="bTop" v-show="isTabFixed"></back-top>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import RecommendView from "./ChildComps/RecommendView";
    import TabControl from "components/content/tabControl/TabControl";
    import GoodsList from "components/content/goods/GoodsList";
    import BackTop from "components/common/backtop/BackTop";
    import HomeSwiper from "./ChildComps/HomeSwiper";
    import {getHomeAllData,getHomeGoods} from "network/home";
    import {onMounted,ref,reactive,computed,watchEffect,nextTick} from 'vue'
    import BScroll from 'better-scroll';

    export default {
        name: "Home",
        setup(){
            const recommends=ref([]);
            let bscroll=reactive({});
            let isTabFixed=ref(false);
            let banref=ref(null);
            let currentType=ref('sales');
            let banners=ref([]);

            //商品列表数据
            const goods=reactive({
                sales:{page:1,list:[]},
                new:{page:1,list:[]},
                recommend:{page:1,list:[]}
            });

            const showGoods=computed(()=>{
                return goods[currentType.value].list;
            })

            const tabClick=(index)=>{
                let types=['sales','new','recommend'];
                currentType.value=types[index];
                //重新计算高度
                nextTick(()=>{
                    bscroll && bscroll.refresh();
                })
            }

            onMounted(()=>{
                getHomeAllData().then(res=>{
                    recommends.value=res.goods.data;
                    banners.value=res.slides;
                    console.log(res.slides);
                });
                getHomeGoods('sales').then(res=>{
                    goods.sales.list=res.goods.data;
                });
                getHomeGoods('recommend').then(res=>{
                    goods.recommend.list=res.goods.data;
                });
                getHomeGoods('new').then(res=>{
                    goods.new.list=res.goods.data;
                });

                //创建BetterScroll对象
                bscroll=new BScroll(document.querySelector('.wrapper'),{
                    probeType:3,//0,1,2,3  3只要在运动就触发scroll事件
                    click:true,//是否允许点击
                    pullUpLoad:true//上拉加载更多，默认式false
                });
                //触发滚动事件
                bscroll.on('scroll',(position)=>{
                    isTabFixed.value=(-position.y)>banref.value.offsetHeight;
                });

                //上拉加载数据
                bscroll.on('pullingUp',()=>{
                    //每次都独立声明所以可以用const
                    const page=goods[currentType.value].page+1;
                    getHomeGoods(currentType.value,page).then(res=>{
                        goods[currentType.value].list.push(...res.goods.data);
                        goods[currentType.value].page+=1;
                    });

                    //加载完展示数据
                    bscroll.finishPullUp();
                    bscroll.refresh();
                });


            })

            const bTop=()=>{
                bscroll.scrollTo(0,0,500);
            }

            return{
                recommends,
                tabClick,
                showGoods,
                isTabFixed,
                banref,
                bTop,
                banners
            }
        },
        components: {
            GoodsList,
            NavBar,
            RecommendView,
            TabControl,
            GoodsList,
            BackTop,
            HomeSwiper
        }
    }
</script>

<style scoped>

    .banners img{
        width: 100%;
        height: auto;
        margin-top: 45px;
    }
    #home{
        height: 100vh;
        position: relative;
    }

    .wrapper{
        position: absolute;
        top: 45px;
        bottom: 50px;
        left: 0;
        right: 0;
        overflow: hidden;
    }
    .content{

    }
</style>