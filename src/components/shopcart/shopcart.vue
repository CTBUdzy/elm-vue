<template>
    <div class="shopcart">
        <div class="content" @click="toggleList">
            <div class="content-left">
                <div class="logo-wrapper">
                    <div class="logo" :class="{highlight:totalCount!=0}">
                        <i class="icon-shopping_cart"></i>
                    </div>
                    <div class="num" v-show="totalCount>0">
                        {{totalCount}}
                    </div>
                </div>
                <div class="price" :class="{highlight:totalPrice!=0}">￥{{totalPrice}}</div>
                <div class="desc">￥另需配送费：{{deliveryprice}}元</div>
            </div>
            <div class="content-right" @click.stop.prevent="pay">
                <div class="pay" :class="{priceline:totalPrice >= minPrice}">
                    <span v-if="totalPrice < minPrice">
                        <span v-show="totalPrice!=0">还差</span>
                        ￥{{minPrice - totalPrice}}起送
                    </span>
                    <span v-else>
                        去结算
                    </span>
                </div>
            </div>
            <!-- <div class="ball-container">
                <div v-for="(ball,index) in balls" :key="index" v-show="ball.show">
                    <transition 
                    v-on:before-enter="beforeEnter" v-on:enter="enter"
                    v-on:after-enter="afterEnter">
                        <div class="ball">
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </div>
            </div> -->
        </div>
        <transition name="fold">
            <div class="shopcart-list" v-show="listshow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" id="carlist">
                    <ul>
                        <li v-for="(food,index) in selectFoods" :key="index" class="food">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span>￥{{food.price*food.count}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
        <transition name="bg">
            <div class="list-mask" v-show="listshow"  @click="toggleList"></div>
        </transition>
    </div>
</template>
<script>
import cartcontrol from '../cartcontrol/cartcontrol.vue'
import BScroll from 'better-scroll'
export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [];
      }
    },
    deliveryprice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  components:{
        cartcontrol
  },
  data() {
    return {
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: [],
      fold:true
    };
  },
  computed: {
    //计算属性
    totalPrice() {
      var total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      var total = 0;
      this.selectFoods.forEach(food => {
        total += food.count;
      });
      return total;
    },
    listshow(){
        if(!this.totalCount){
            this.fold = true;
            return false;
        }
        var show = !this.fold;
        if(show){
            this.$nextTick(() => {
                if(!this.scrll){
                    this.scrll = new BScroll(document.getElementById('carlist'),{
                    click:true  //允许点击
                }); //起滚动作用
                }
            })
        }
        return show;
    }
  },
  created(){
  },
  methods: {
    drop(el) {
      for (var i = 0; i < this.balls.length; i++) {
        var ball = this.balls[i];
        ball.show = true;
        ball.el = el;
        this.dropBalls.push(ball);
        return;
      }
    },
    toggleList(){
        if(!this.totalCount){
            return;
        }
        this.fold = !this.fold;
    },
    empty(){
        this.selectFoods.forEach((food) =>{
            food.count = 0;
        });
    },
    pay(){
        if(this.totalPrice < this.minPrice){
            return;
        }
        window.alert(`支付${this.totalPrice}元`);
    }

    // beforeEnter(el) {
    //   var count = this.balls.length;
    //   while (count--) {
    //     var ball = this.balls[count];
    //     if (ball.show) {
    //       var rect = ball.el.getBoundingClientRect();
    //       var x = rect.left - 32;
    //       var y = -(window.innerHeight - rect.top - 22);
    //       el.style.display = "";
    //       el.style.webkitTansform = `translate3d(0,${y}px,0)`;
    //       el.style.transform = `translate3d(0,${y}px,0)`;
    //       var inner = el.getElementByClassName("inner-hook")[0];
    //       inner.style.webkitTansform = `translate3d(${x}px,0,0)`;
    //       inner.style.transform = `translate3d(${x}px,0,0)`;
    //       console.log(1);
    //     }
    //   }
    // },
    // enter(el) {
    //   var rf = el.offestHeight;
    //   this.$nextTick(() => {
    //     el.style.webkitTansform = "translate3d(0,0,0)";
    //     el.style.transform = "translate3d(0,0,0)";
    //     var inner = el.getElementByClassName("inner-hook")[0];
    //     inner.style.webkitTansform = "translate3d(0,0,0)";
    //     inner.style.transform = "translate3d(0,0,0)";
    //     console.log(2);
    //   });
    // },
    // afterEnter(el) {
    //   var ball = this.dropBalls.shift();
    //   if (ball) {
    //     ball.show = false;
    //     el.style.display = "none";
    //   }
    //   console.log(3);
    // }
  }
};
</script>
<style lang="stylus" scoped>

 @import '../../common/stylus/mixin';
.shopcart 
    position: fixed;
    width: 100%;
    height: 48px;
    bottom: 0;
    left: 0;
    z-index: 50;

    .content 
        display: flex;
        background: #141d27;
        color: rgba(255, 255, 255, 0.4);
        .content-left 
            flex: 1;
            .logo-wrapper 
                display: inline-block;
                position: relative;
                top: -10px;
                margin: 0 12px;
                padding: 6px;
                height: 56px;
                width: 56px;
                box-sizing: border-box;
                vertical-align: top;
                border-radius: 50%;
                background: #141d27;

                .logo 
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: #2b343c;
                    text-align: center;

                    &.highlight 
                        background: rgb(0, 160, 220);

                        .icon-shopping_cart 
                            color: #ffffff;
                    .icon-shopping_cart 
                        line-height: 44px;
                        font-size: 24px;
                        color: #80858a;
                .num 
                    position: absolute;
                    top: 0px;
                    right: 0;
                    width: 24px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    border-radius: 16px;
                    font-size: 9px;
                    font-weight: 700;
                    color: #ffffff;
                    background: rgb(240, 20, 20);
                    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.4);
            .price 
                display: inline-block;
                vertical-align: top;
                line-height: 24px;
                margin-top: 12px;
                padding-right: 12px;
                box-sizing: border-box;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 16px;
                font-weight: 700;

                &.highlight 
                    color: #ffffff;
            .desc 
                display: inline-block;
                vertical-align: top;
                margin: 12px 0 0 12px;
                line-height: 24px;
                font-size: 10px;
            
        
        .content-right 
            flex: 0 0 105px;
            width: 105px;
            .pay 
                height: 48px;
                line-height: 48px;
                text-align: center;
                font-size: 12px;
                font-weight: 700;
                background: #2b333b;
                &.priceline 
                    background: rgb(0, 160, 220);
                    color: #ffffff;
                    font-size: 16px;
    .ball-container 
        .ball 
            position: fixed;
            left: 32px;
            bottom: 22px;
            z-index: 200;
            transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
            .inner 
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: rgb(0, 160, 220);
                transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
    .shopcart-list
        position absolute
        top 0px
        left 0
        z-index -1
        width 100%        
        transition all 0.5s
        transform translate3d(0,-100%,0)
        &.fold-enter,&.fold-leave-active
            transform translate3d(0,0,0)
        .list-header
            height 40px
            line-height 40px
            padding 0 18px
            background #f3f5f7
            border-bottom 1px solid rgba(7,17,27,0.1)
            .title
                float left
                font-size 14px
                color rgb(7,17,27)
            .empty
                float right
                font-size 12px
                color rgb(0,160,220)
        .list-content
            padding 0 18px
            max-height 217px
            overflow hidden
            background #ffffff
            .food
                position relative
                padding 12px 0
                box-sizing border-box
                border-1px(rgba(7,17,27,0.1))
                .name
                    line-height 24px
                    font-size 14px
                    color rgb(7,17,27)
                .price
                    position absolute
                    right 90px
                    bottom 12px
                    line-height 24px
                    font-size 14px
                    font-weight 700
                    color rgb(240,20,20)
                .cartcontrol-wrapper
                    position absolute
                    right 0
                    bottom 6px
    .list-mask
        position fixed
        top 0px
        left 0px
        width 100%
        height 100%
        z-index -2
        opacity 1
        backdrop-filter blur(10px)
        transition all 0.5s
        background rgba(7,17,27,0.6)
        &.bg-enter,&.bg-leave-active
            opacity 0
            background rgba(7,17,27,0)
</style>
