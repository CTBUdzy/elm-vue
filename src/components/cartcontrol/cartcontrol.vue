<template>
    <div class="cartcontrol">
        <transition name="move">
            <div class="cart-decrease" 
            v-show="food.count>0" @click="removecount()">
            <transition name="cal">
                <span class="icon-remove_circle_outline inner"></span>
            </transition>
            </div>
        </transition>
        <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
        <div class="cart-add icon-add_circle" @click="addcount()"></div>
    </div>
</template>

<script>
    import Vue from 'vue';
export default {
    props:{
        food:{
            type:Object
        }
    },
    methods:{
        addcount(){
            if(!this.food.count){
                Vue.set(this.food,'count',1); //给food增加一个名为count的字段
                this.food.count = 1;
            }else{
                this.food.count++;
            } 
            //已废除this.$dispatch('cart.add',event.target);  //发送事件
           this.$emit('cart-add',event.target);
        },
        removecount(){
            this.food.count--;
        }
    }
}
</script>
<style lang="stylus" scoped>
    .cartcontrol
        font-size 0
        .cart-decrease
            display inline-block
            padding 6px 
            opacity 1
            transition all 0.4s linear
            transform translate3d(0,0,0)
            .inner
                line-height 24px
                color rgb(0,160,220)
                font-size 24px
                transition all 0.4s linear
                transform rotate(0deg)
                &.cal-enter,&.cal-leave-active
                    transform rotate(720deg)
            &.move-enter,&.move-leave-active
                opacity 0
                transform translate3d(24px,0,0)
                    
        .cart-count
            display inline-block
            vertical-align top
            width 12px
            padding-top 6px
            line-height 24px
            text-align center
            font-size 10px
            color rgb(147,153,159)
        .cart-add
            display inline-block
            padding 6px 
            line-height 24px
            color rgb(0,160,220)
            font-size 24px
</style>

