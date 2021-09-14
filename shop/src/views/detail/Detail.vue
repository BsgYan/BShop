<template>
    <div>
        <nav-bar>
            <template v-slot:left>&lt</template>
            <template v-slot:default>商品详情</template>
        </nav-bar>
        <van-image style="margin-top:50px"
                   lazy-load
                   width="100%"
                   :src="detail.cover_url" />
        <van-card
                style="text-align:left"
                :num="detail.stock"
                :price="detail.price + '.00'"
                :desc="detail.description"
                :title="detail.title"
        >
            <template #tags>
                <van-tag plain type="danger">新书</van-tag>
                <van-tag v-if="detail.is_recommend == 1" plain type="danger"
                >推荐</van-tag
                >
            </template>
            <template #footer>
                <van-button type="danger" @click="handleAddCart">加入购物车</van-button>
                <van-button type="warning" @click="goToCart">立即购买</van-button>
            </template>
        </van-card>

        <van-tabs v-model="active">
            <van-tab title="概述">
                <div class="content" v-html="detail.details"></div>
            </van-tab>
            <van-tab title="热评">
                <div class="content" v-html="detail.comments"></div>
            </van-tab>
            <van-tab title="相关图书">
                <goods-list :goods="like_goods"></goods-list>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
    import NavBar from "components/common/navbar/NavBar";
    import {useRoute,useRouter} from 'vue-router';
    import {useStore} from 'vuex';
    import {ref,onMounted,reactive,toRefs} from 'vue';
    import {getDetail} from "network/detail";
    import GoodsList from "components/content/goods/GoodsList";
    import {addCart} from "network/cart";
    import {Toast} from 'vant';
    export default {
        name: "Detail",
        setup(){
            const route=useRoute();
            const router=useRouter();
            const store=useStore();
            let id=ref(0);
            let book=reactive({
                detail:{},
                like_goods:[]
            });
            onMounted(()=>{
                id.value=route.query.id;
                getDetail(id.value).then(res=>{
                    book.detail=res.goods;
                    book.like_goods=res.like_goods;
                })
            })
            id.value=route.query.id;

            //添加购物车
            const handleAddCart=()=>{
                addCart({goods_id:book.detail.id,num:1}).then(res=>{
                    if(res.status=='204'||res.status=='201'){
                        Toast.success("添加成功");
                        store.dispatch("updateCart");
                    }else {
                        Toast.success("下手晚了，商品已经没了");
                    }
                })
            }
            //立即购买
            const goToCart=()=>{
                addCart({ goods_id: book.detail.id, num: 1 }).then((res) => {
                    if (res.status == '204' || res.status == '201') {
                        Toast.success("添加成功");
                        store.dispatch("updateCart");
                        router.push({ path: "/shopcart" });
                    } else {
                        Toast.success("下手晚了，商品已经没了");
                    }
                });
            }
            return {
                id,
                book,
                ...toRefs(book),
                handleAddCart,
                goToCart
            }
        },
        components: {GoodsList, NavBar}
    }
</script>

<style scoped lang="scss">
    .content{
        padding: 10px;
        margin-bottom: 50px;
    }
</style>