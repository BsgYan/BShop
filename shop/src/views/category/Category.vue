<template>
    <div>
        <nav-bar>
            <template v-slot:left>&lt</template>
            <template v-slot:default>商品分类</template>
        </nav-bar>

        <div id="mainbox">
            <div class="ordertab">
                <!--默认会把id传给tabClick-->
                <van-tabs v-model="active" @click="tabClick">
                    <van-tab title="销量排序"></van-tab>
                    <van-tab title="价格排序"></van-tab>
                    <van-tab title="评论排序"></van-tab>
                </van-tabs>
            </div>
            <div class="leftmenu">
                <van-sidebar class="leftmenu" v-model="activeKey">
                    <van-collapse v-model="activeName" accordion>
                        <van-collapse-item v-for="item in categories"
                                           :key="item.id"
                                           :title="item.name"
                                           :name="item.name">

                            <van-sidebar-item
                                    v-for="sub in item.children"
                                    :title="sub.name"
                                    :key="sub.id"
                                    @click="getGoods(sub.id)"
                            />
                        </van-collapse-item>
                    </van-collapse>
                </van-sidebar>
            </div>
            <div class="goodslist">
                <div class="content">
                    <van-card
                            v-for="item in showGoods"
                            @click="itemClick(item.id)"
                            :key="item.id"
                            :num="item.comments_count"
                            :tab="item.comments_count >=0 ? '流行':'标签'"
                            :price="item.price"
                            :desc="item.updated_at"
                            :title="item.title"
                            :thumb="item.cover_url"
                            :lazy-load="true"
                    />
                </div>
            </div>
        </div>
        <back-top @bTop="bTop" v-show="isTabFixed"></back-top>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {getCategory,getCategoryGoods} from "network/category";
    import {useRouter} from 'vue-router';
    import {ref,reactive,onMounted,computed,nextTick,watchEffect} from 'vue';
    import BackTop from "components/common/backtop/BackTop";
    import BScroll from 'better-scroll';
    export default {
        name: "Category",
        setup(){
            let active=ref(1);
            let activeKey=ref(0);
            let categories=ref([]);
            let activeName=ref(1);
            let bscroll=reactive({});
            let isTabFixed=ref(false);
            const router=useRouter();
            const bTop=()=>{
                bscroll.scrollTo(0,0,500);
            }

            //当前的排序条件
            let currentOrder=ref('sales');
            //当前的分类id
            let currentCid=ref(0);

            //数据模型
            const goods=reactive({
                sales:{page:1,list:[]},
                price:{page:1,list:[]},
                comments_count:{page:1,list:[]}
            })

            const showGoods=computed(()=>{
                return goods[currentOrder.value].list;
            })

            onMounted(()=>{
                getCategory().then(res=>{
                    categories.value=res.categories
                })
                getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
                    goods[currentOrder.value].list=res.goods.data;
                    //重新计算高度
                    nextTick(()=>{
                        bscroll && bscroll.refresh();
                    })
                })

                //创建BetterScroll对象
                bscroll=new BScroll(document.querySelector('.goodslist'),{
                    probeType:3,//0,1,2,3  3只要在运动就触发scroll事件
                    click:true,//是否允许点击
                    pullUpLoad:true//上拉加载更多，默认式false
                });
                //触发滚动事件
                bscroll.on('scroll',(position)=>{
                    isTabFixed.value=(-position.y)>300;
                });

                //上拉加载数据
                bscroll.on('pullingUp',()=>{
                    //每次都独立声明所以可以用const
                    const page=goods[currentOrder.value].page+1;
                    getCategoryGoods(currentOrder.value,currentCid.value,page).then(res=>{
                        goods[currentOrder.value].list.push(...res.goods.data);
                        goods[currentOrder.value].page+=1;
                    })

                    //加载完展示数据
                    bscroll.finishPullUp();
                    bscroll.refresh();
                });

            })

            //排序选项卡
            const tabClick=(index)=>{
                let orders=['sales','price','comments_count'];
                currentOrder.value=orders[index];
                getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
                    goods[currentOrder.value].list=res.goods.data;

                    //重新计算高度
                    nextTick(()=>{
                        bscroll && bscroll.refresh();
                    })
                })

            }
            //通过分类的到商品
            const getGoods=(cid)=>{
                currentCid.value=cid;
                getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
                    goods[currentOrder.value].list=res.goods.data;
                    //重新计算高度
                    nextTick(()=>{
                        bscroll && bscroll.refresh();
                    })
                })
            }

            return {
                activeKey,
                categories,
                activeName,
                active,
                tabClick,
                currentOrder,
                getGoods,
                currentCid,
                showGoods,
                bTop,
                isTabFixed,
                itemClick:(id)=>{
                    router.push({path:'/detail',query:{id}})
                }
            }
        },
        components: {
            NavBar,
            BackTop
        }
    }
</script>

<style scoped lang="scss">
    #mainbox{
        margin-top: 45px;
        .ordertab{
            height: 50px;
            position: fixed;
            right: 0;
            top: 45px;
            left: 130px;
            z-index: 20;
        }
        .leftmenu{
            width: 130px;
            position: fixed;
            top: 95px;
            left: 0;
        }
        .goodslist{
            /*position: absolute;*/
            /*top: 100px;*/
            /*left: 130px;*/
            /*right: 0;*/
            /*height: 100px;*/
            position: absolute;
            top: 100px;
            bottom: 50px;
            left: 130px;
            right: 0;
            overflow: hidden;
        }
    }
</style>