<template>
    <div class="ratingselect">
        <div class="rating-type border-1px">
            <span @click="select(2,$event)" class="block positive" :class="{active:selectType == 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span @click="select(0,$event)" class="block positive" :class="{active:selectType == 0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span @click="select(1,$event)" class="block negative" :class="{active:selectType == 1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <div class="switch" :class="{'on':onlyContent}">
            <span class="icon-check_circle" @click="toggleContent($event)"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>

<script>
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;

export default {
    props:{
        ratings:{
            type:Array,
            default(){
                return [];
            }
        },
        selectType:{
            type:Number,
            default:ALL
        },
        onlyContent:{
            type:Boolean,
            default:false
        },
        desc:{
            type:Object,
            default(){
                return{
                    all:'全部',
                    positive:'满意',
                    negative:'不满意'
                }
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
    methods:{
        select(type,event){
            console.log(this.onlyContent);
            if(!event._constructed){
                return;
            }
            this.selectType = type;
            this.$emit("ratingtype.select",type); //派发一个事件，让父组件监听数据的变化
        },
        toggleContent(event){
            if(!event._constructed){
                return;
            }
            this.onlyContent = !this.onlyContent;
            this.$emit("content.toggle",this.onlyContent);
        }
    }
}
</script>

<style lang="stylus" scoped>
    @import '../../common/stylus/mixin';

    .ratingselect
        .rating-type
            padding 18px
            margin 0 18px
            border-1px(rgba(1,17,27,0.2))
            font-size 0px
            .block
                display inline-block
                padding 8px 12px
                border-radius 1px
                margin-right 8px
                color rgb(77,85,93)
                font-size 12px
                line-height 18px
                &.active
                    color #fff
                &.positive
                    background rgba(0,160,220,0.2)
                    &.active
                        background rgba(0,160,220,1)
                &.negative
                    background rgba(77,85,93,0.2)
                    &.active
                        background rgba(77,85,93,1)
                .count
                    font-size 8px
                    margin-left 2px
        .switch
            padding 12px 18px
            line-height 24px
            border-bottom 1px solid rgba(1,17,27,0.2)
            color rgb(147,153,159)
            font-size 0
            &.on  
                .icon-check_circle
                    color #00c850
            .icon-check_circle
                display inline-block
                vertical-align top
                margin-right 4px
                font-size 24px
            .text
                font-size 12px
                vertical-align top
            
            
</style>

