<template>
<div class="rating" id="rating">
    <div class="rating-content">
        <div class="overview">
            <div class="overview-left">
                <h2 class="score">{{seller.score}}</h2>
                <div class="title">综合评分</div>
                <div class="rank">高于周边商家{{seller.rankRate}}%</div>
            </div>
            <div class="overview-right">
                <div class="score-wrapper">
                    <span class="title">服务态度</span>
                    <star :size="36" :score="seller.serviceScore"></star>
                    <span class="score">{{seller.serviceScore}}</span>
                </div>
                <div class="score-wrapper">
                    <span class="title">商品评分</span>
                    <star :size="36" :score="seller.foodScore"></star>
                    <span class="score">{{seller.foodScore}}</span>
                </div>
                <div class="delivery-wrapper">
                    <span class="title">送达时间</span>
                    <span class="delivery">{{seller.deliveryTime}}分钟</span>
                </div>
            </div>
        </div>
        <split></split>
        <ratingselect @on-content-change='onlyContentChange' @on-type-change="selectTypeChange" :select-type="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="ratings"></ratingselect>
        <div class="rating-wrapper">
            <ul>
                <li class="rating-item border-1px" v-for="(rating,index) in ratings" :key="index" v-show="needShow(rating.rateType, rating.text)">
                    <div class="avatar">
                        <img :src="rating.avatar" width="28" height="28">
                    </div>
                    <div class="content">
                        <h2 class="name">{{rating.username}}</h2>
                        <div class="star-wrapper">
                            <star :size="24" :score="rating.score"></star>
                            <span class="delivery" v-show="rating.deliveryTime">
                                {{rating.deliveryTime}}
                            </span>
                        </div>
                        <p class="text">
                            {{rating.text}}
                        </p>
                        <div class="recommend" v-show="rating.recommend">
                            <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                            <span class="item" v-for="(item,index) in rating.recommend" :key="index">
                                {{item}}
                            </span>
                        </div>
                        <div class="time">
                            {{rating.rateTime | formatDate}}
                        </div>
                    </div>

                </li>
            </ul>
        </div>
    </div>
</div>
</template>
<script>
import BScroll from 'better-scroll'
import star from '../star/star.vue'
import split from '../split/split.vue'
import ratingselect from '../ratingselect/ratingselect.vue'

import {formatDate} from '../../common/js/date'

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
const ERR_OK = 0;

export default {
    props:{
        seller:{
        }
    },
    data(){
        return{
            ratings:[],
            selectType: ALL,
            onlyContent: true,
            desc:{
                all:'全部',
                positive:'满意',
                negative:'不满意'
            }
        }
    },
    computed:{  //计算属性
        positives(){
            return this.ratings.filter((rating) => {
                return rating.rateType === POSITIVE;
            });
        },
        negatives(){
            return this.ratings.filter((rating) => {
                return rating.rateType === NEGATIVE;
            });
        }
    },
    created(){
        this.$http.get('/api/ratings').then((res) => {
            res = res.body;
            if(res.errno === ERR_OK){
                this.ratings = res.data;
                console.log(this.ratings);
                this.$nextTick(() =>{
                this.scroll = new BScroll(document.getElementById('rating'),{
                    click:true
                })
            })
            }
        })
    },
    components:{
        star,split,ratingselect
    },
    filters:{
        formatDate(time){
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm');
        }
    },
    event:{//监听事件
        'ratingtype.select'(type){
            console.log(11);
            this.selectType = type;
            this.$nextTick(() => {
                this.scroll.refresh();//重新拉伸
            })
            
        },
        'content.toggle'(onlyContent){
            this.onlyContent = onlyContent;
            this.$nextTick(() => {
                this.scroll.refresh();//重新拉伸
            })
        }
    },
    methods:{
        needShow(type,text){//过滤评论
            if(this.onlyContent && !text){
                return false;
            }
            if(this.selectType === ALL){
                return true;
            }else{
                return type === this.selectType;
            }
        },
        selectTypeChange(type) {
            console.log(type);
            this.selectType=type;
        },
        onlyContentChange(val){
            this.onlyContent=val;
        }
    }
}
</script>
<style lang="stylus" scoped>
    @import '../../common/stylus/mixin';
    .rating
        position absolute
        top 170px
        left 0px
        bottom 0px
        width 100%
        overflow hidden
        .rating-content
            .overview
                display flex
                padding 18px 0
                .overview-left
                    flex 0 0 150px
                    padding 6px 0
                    width 150px
                    border-right 1px solid rgba(7,17,27,0.1)
                    text-align center
                    @media only screen and (max-width :320px)
                        flex 0 0 120px
                        width 120px
                    .score
                        margin-bottom 6px
                        line-height 28px
                        font-size 24px
                        color rgb(255,153,0)
                    .title
                        margin-bottom 8px
                        line-height 12px
                        font-size 12px
                        color rgb(7,17,27)
                    .rank
                        line-height 10px
                        font-size 10px
                        color rgb(147,153,159)
                .overview-right
                    float 1
                    padding 6px 0 6px 24px
                    @media only screen and (max-width :320px)
                        padding 6px 0 6px 8px
                    .score-wrapper,.delivery-wrapper
                        margin-bottom 6px
                        font-size 0
                        .title
                            font-size 12px
                            line-height 18px
                            vertical-align top
                            color rgb(7,17,27)
                        .star
                            display inline-block
                            margin 0 12px
                            vertical-align top
                        .score
                            display inline-block
                            vertical-align top
                            font-size 12px
                            line-height 18px
                            color rgb(255,153,0)
                        .delivery
                            font-size 12px
                            line-height 18px
                            color rgb(147,153,159)
                            margin-left 12px
            .rating-wrapper
                padding 0 18px
                .rating-item
                    display flex
                    padding 18px 0
                    border-1px(rgba(7,17,27,0.1))
                    .avatar
                        float 0 0 28px
                        width 28px
                        margin-right 12px
                        img
                            border-radius 50%
                    .content
                        position relative
                        flex 1
                        .name
                            margin-bottom 4px
                            line-height 12px
                            font-size 10px
                            color rgb(7,17,27)
                        .star-wrapper
                            margin-bottom 6px
                            font-size 0
                            .star
                                display inline-block
                                margin-right 6px
                                vertical-align top
                            .delivery
                                display inline-block
                                vertical-align top
                                line-height 12px
                                font-size 10px
                                color rgb(147,153,159)
                        .text
                            line-height 18px
                            color rgb(7,17,27)
                            font-size 12px
                            margin-bottom 8px
                        .recommend
                            line-height 16px
                            font-size 0px
                            .icon-thumb_up,.item   
                                display inline-block
                                margin 0 8px 4px 0
                                font-size 9px
                            .icon-thumb_up
                                color rgb(0,160,220)
                            .icon-thumb_down
                                font-size 9px
                                color rgba(7,17,27,0.2)
                            .item 
                                padding 0 6px
                                border 1px solid rgba(7,17,27,0.1)
                                border-radius 1px
                                color rgb(147,153,159)
                                background #fff
                        .time
                            position absolute
                            top 0px
                            right 0px
                            line-height 12px
                            font-size 10px
                            color rgb(147,153,159)


</style>


