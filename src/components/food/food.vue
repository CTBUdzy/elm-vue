<template>
    <transition name="move">
        <div class="food" v-show="showFlog" id="foodpage">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image">
                    <div class="back">
                        <i class="icon-arrow_lift" @click="hide"></i>
                    </div>  
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                     <div class="cartcontrol-warpper">
                        <cartcontrol :food="food"></cartcontrol>
                    </div>
                    <div @click="addFirst($event)" class="buy" v-show="!food.count || food.count == 0">
                        加入购物车
                    </div>
                </div>
               <split  v-show="food.info"></split>
               <div class="info" v-show="food.info">
                   <h2 class="title">商品介绍</h2>
                   <p class="text">{{food.info}}</p>
               </div>
               <split></split>
               <div class="rating">
                   <h2 class="title">商品评价</h2>
                   <ratingselect @on-content-change='onlyContentChange' @on-type-change="selectTypeChange" :select-type="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
               </div>
               <div class="rating-wrapper">
                   <ul v-show="food.ratings && food.ratings.length">
                       <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item border-1px">
                           <div class="user">
                                <span class="name">{{rating.username}}</span>
                                <img class="avatar" width="12" height="12" :src="rating.avatar">
                            </div>
                            <div class="time">{{rating.rateTime  | formatDate}}</div>
                            <p class="text">
                                <span :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"></span>
                                {{rating.text}}
                            </p>
                       </li>
                   </ul>
                    <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
                        暂无评价
                    </div>
               </div>
            </div>
        </div>
    </transition>
</template>
<script>
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol.vue'
import split from '../split/split.vue'
import ratingselect from '../ratingselect/ratingselect.vue'
import Vue from 'Vue';

import {formatDate} from '../../common/js/date'   //带有“{}”是引入方式

    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;

export default {
    props:{
        food:{
            type:Object
        }
    },
    data(){
        return{
            showFlog:false,
            selectType: ALL,
            onlyContent: true,
            desc:{
                all:'全部',
                positive:'推荐',
                negative:'吐槽'
            }
        }
    },
    components:{
        cartcontrol,split,ratingselect
    },
    methods:{
        selectTypeChange(type) {
            this.selectType=type;
        },
        onlyContentChange(val){
            this.onlyContent=val;
        },
        show(){
            this.showFlog = true;
            this.selectType = ALL;
            this.onlyContent = false;
            this.$nextTick(() =>{
                this.scroll = new BScroll(document.getElementById('foodpage'),{
                    click:true
                })
            })
        },
        hide(){
            this.showFlog = false;
        },
        addFirst(event){
            if(!event._constructed){
                return;
            }
            Vue.set(this.food,'count',1)
        },
        needShow(type,text){//过滤评论
            if(this.onlyContent && !text){
                return false;
            }
            if(this.selectType === ALL){
                return true;
            }else{
                return type === this.selectType;
            }
        }
    },
    event:{//监听事件
        'ratingtype.select'(type){
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
    filters:{
        formatDate(time){
            let date = new Date(time);
            return formatDate(date,'yyyy-MM-dd hh:mm');
        }
    }
}
</script>
<style lang="stylus" scoped>

    @import '../../common/stylus/mixin';
    .food
        position fixed
        left 0
        top 0px
        bottom 48px
        z-index 30
        width 100%
        transition all 0.2s linear
        background #fff
        transform translate3d(0,0,0)
        &.move-enter,&.move-leave-to
            transform translate3d(100%,0,0)
        .image-header
            position relative
            width 100%
            height 0
            padding-top 100%
            img
                position absolute
                top 0px
                left 0
                width 100%
                height 100%
            .back
                position absolute
                top 10px
                left 0
                .icon-arrow_lift
                    display block
                    padding 10px
                    font-size 20px
                    color #fff
        .content
            padding 18px
            position relative
            .title
                line-height 14px
                margin-bottom 8px
                font-size 14px
                font-weight 700
                color rgb(7,17,27)
            .detail
                margin-bottom 18px
                line-height 10px
                font-size 0
                height 10px
                margin-bottom 3px
                .sell-count,.rating
                    font-size 10px
                    color rgb(147,153,159)
                .sell-count
                    margin-right 12px
            .price
                font-weight 700
                line-height 24px
                .now
                    color rgb(240,20,20)
                    margin-right 8px 
                    font-size 14px
                .old
                    text-decoration line-through
                    font-size 10px
                    color rgb(147,153,159)
            .cartcontrol-warpper
                position absolute
                right 12px
                bottom 12px
            .buy
                position absolute
                right 18px
                bottom 18px
                z-index 10
                height 24px
                line-height 24px
                padding 0 12px 
                box-sizing border-box
                font-size 10px
                border-radius 12px
                color #ffffff
                background rgb(0,160,220)
        .info
            padding 18px
            .title
                font-size 14px
                margin-bottom 6px
                font-weight 700
                line-height 14px
                color rgb(7,17,27)
            .text
                line-height 24px
                padding 0 8px
                font-size 12px
                color rgb(77,85,93)
        .rating
            padding-top 18px
            .title
                font-size 14px
                margin-left 18px
                font-weight 700
                line-height 14px
                color rgb(7,17,27)
        .rating-wrapper
            padding 0 18px
            .rating-item
                position relative
                padding 16px 0
                border-1px(rgba(7,17,27,0.2))
                .user
                    position absolute
                    right 0
                    top 16px
                    font-size 0
                    line-height 12px
                    .name
                        display inline-block
                        font-size 10px
                        vertical-align top
                        color rgb(147,153,159)
                        margin-right 6px
                    .avatar
                        border-radius 50%
                .time
                    margin-bottom 6px   //影响布局的属性写在前面
                    line-height 12px
                    font-size 10px
                    color rgb(147,153,159)
                .text
                    line-height 16px
                    font-size 12px
                    color rgb(7,17,27)
                    font-weight 700
                    .icon-thumb_up,.icon-thumb_down
                        margin-right 4px
                        line-height 16px
                        font-size 12px
                    .icon-thumb_up
                        color rgb(0,160,220)
                    .icon-thumb_down
                        color rgb(147,153,159)
            .no-rating
                padding 16px 0
                font-size 12px
                color rgb(147,153,159)
</style>
