<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img width="64" height="64" :src="seller.avatar">
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-cont" @click="showDeatil">
                <span class="count">{{seller.supports.length}}个</span>
                 <i class="icon-keyboard_arrow_right"></i>       
            </div>
        </div>
        <div class="bulletin-wrapper">
            <span class="bulletin-title">
            </span><span class="bulletin-text">{{seller.bulletin}}</span>
            <i class="icon-keyboard_arrow_right"  @click="showDeatil"></i>   
        </div>
        <div class="background">
            <img :src="seller.avatar" width="100%" height="100%">
        </div>
        <transition name="fade">
        <div class="detail" v-show="detailShow">
            <div class="detail-warpper clearfix">
                <div class="detail-main">
                    <h1 class="name">{{seller.name}}</h1>
                    <div class="star-wrapper">
                        <star :size="48" :score="seller.score"></star>
                    </div>
                    <div class="title">
                        <div class="line"></div>
                        <div class="text">优惠信息</div>
                        <div class="line"></div>
                    </div>
                    <ul v-if="seller.supports" class="supports">
                        <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
                            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                            <span class="text">{{seller.supports[index].description}}</span>
                        </li>
                    </ul>
                    <div class="title">
                        <div class="line"></div>
                        <div class="text">商家公告</div>
                        <div class="line"></div>
                    </div>
                    <div class="bulletin">
                        <p class="content">{{seller.bulletin}}</p>
                    </div>
                </div>
            </div>
            <div class="detail-close">
                <i class="icon-close" @click="closedetail"></i>
            </div>
        </div>
        </transition>
    </div>
</template>
<script>
import star from '../star/star.vue'
export default {
    props:{
        seller:{
            type:""
        }
    },
    data(){
        return{
            detailShow:false
        }
    },
    components:{
        star
    },
    created(){
        this.classMap=['decrease','discount','guarantee','invoice','special']
    },
    methods:{
        showDeatil(){
            this.detailShow  = true
        },
        closedetail(){
            this.detailShow = false
        }
    }
}
</script>
<style lang="stylus">
    @import '../../common/stylus/base';
    @import '../../common/stylus/mixin';
    .header
        overflow hidden
        position relative
        color :#fff
        background rgba(1,17,27,0.5);
        .content-wrapper
            padding:24px 12px 12px 24px
            font-size :0px
            display relative
            .avatar
                display :inline-block
                vertical-align top
                img
                    border-radius 2px
            .content
                display :inline-block
                font-size :14px
                margin-left 12px
                .title
                    margin 0px 0 8px 0
                    .brand
                        display inline-block
                        vertical-align top
                        width 30px
                        height 18px
                        bg-image('brand')
                        background-size 30px 18px
                        background-repeat no-repeat
                    .name
                        margin-left 6px
                        font-size 16px
                        line-height 18px
                        font-weight bold
                .description
                    margin-bottom 10px
                    line-height 12px
                    font-size 12px
                .support
                    .icon
                        display inline-block
                        vertical-align top
                        width 12px
                        height 12px
                        margin-left 4px
                        background-size 12px 12px
                        background-repeat no-repeat
                        display relative 
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                            bg-image('discount_1')
                        &.guarantee
                            bg-image('guarantee_1')
                        &.invoice
                            bg-image('invoice_1')
                        &.special
                            bg-image('special_1')
                    .text
                        line-height 12px
                        font-size 10px
            .support-cont
                position absolute
                right 12px
                bottom  32px
                padding 0 8px
                line-height 24px
                height 24px
                border-radius 14px
                background rgba(0,0,0,0.2)
                text-align center
                .count
                    vertical-align top
                    font-size 10px
                .icon-keyboard_arrow_right
                    position relative
                    top 5px
                    font-size 10px
                    margin-left 2px
        .bulletin-wrapper
            background rgba(7,17,27,0.2)
            height 28px
            line-height 28px
            padding 0 22px 0 12px
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
            .bulletin-title
                display inline-block
                width 22px
                height 12px
                bg-image('bulletin')
                background-size 22px 12px
                background-repeat no-repeat
            .bulletin-text
                vertical-align top
                font-size 10px
                margin 0 4px
            .icon-keyboard_arrow_right
                position: absolute
                font-size: 10px
                right: 12px
                bottom: 8px
        .background
            position absolute
            top 0px
            right 0px
            width 100%
            height 100%
            z-index -1
            filter: blur(10px)
        .detail
            position fixed
            z-index 100
            top 0px
            left 0px
            width 100%
            height 100%
            overflow auto
            transition all 0.5s
            opacity 1
            background rgba(7,17,27,0.8)
            &.fade-enter, &.fade-leave-active
                opacity 0
                background rgba(7,17,27,0)
            .detail-warpper
                min-height 100%
                width 100%
                .detail-main
                    margin-top 64px
                    padding-bottom 64px
                    .name
                        line-height 16px
                        text-align center
                        font-size 16px
                        font-weight 700
                    .star-wrapper
                        margin-top 18px
                        padding 2px 0
                        text-align center
                    .title
                        display flex
                        width 80%
                        margin 28px auto 24px auto
                        .line
                            flex 1
                            position relative
                            top -6px
                            border-bottom 1px solid rgba(255,255,255,0.2)
                        .text
                             padding 0 12px
                             font-weight 700
                             font-size 14px
                    .supports
                        width 80%
                        margin 0 auto 
                        .support-item
                            padding 0 12px 
                            margin-bottom 12px
                            font-size 0
                            &.last-child
                                margin-bottom 0
                            .icon
                                display inline-block
                                width 16px 
                                height 16px
                                vertical-align top
                                margin-right 12px
                                background-size 16px 16px 
                                background-repeat no-repeat
                                &.decrease
                                    bg-image('decrease_1')
                                &.discount
                                    bg-image('discount_2')
                                &.guarantee
                                    bg-image('guarantee_2')
                                &.invoice
                                    bg-image('invoice_2')
                                &.special
                                    bg-image('special_2')
                            .text
                               line-height 16px 
                               font-size 12px
                    .bulletin
                        margin 0 auto 
                        width 80%
                        .content
                            padding 0 12px
                            line-height 24px
                            font-size 12px
                            text-indent 2em
                    .title
                        display flex
                        width 80%
                        margin 28px auto 24px auto
                        .line
                            flex 1
                            border-bottom 1px solid rgba(255,255,255,0.5)
                            position relative
                            top -6px
                        .text
                            padding 0 12px
                            font-weight 700
                            font-size 14px
            .detail-close
                position relative
                width 32px
                height 32px
                margin -64px auto 0 auto
                clear both
                font-size 32px
</style>


