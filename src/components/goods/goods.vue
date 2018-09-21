<template>
    <div class="goods">
        <div class="menu-wrapper" id="menuwrapper">
            <ul>
                <li v-for="(item,index) in goods" :key="index" class="menu-item" 
                :class="{current:currentIndex === index}" @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <span v-show="item.type>0" class="icon"
                            :class="classMap[item.type]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" id="foodwrapper">
            <ul>
                <li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="(food,key) in item.foods" :key="key" class="food-item border-1px">
                            <div class="icon">
                                <img :src="food.icon" width="57" height="57">
                            </div>
                            <div class="content">
                                <h2 class="name">
                                    {{food.name}}
                                </h2>
                                <p class="desc">
                                    {{food.description}}
                                </p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span>
                                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                            </div>
                            <div class="crartcontrol-wrapper">
                                <cartcontrol :food='food' v-on:cart-add="cartAdd"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopcart :select-foods="selectFoods" :deliveryprice="seller.deliveryPrice" 
        :minPrice="seller.minPrice" ref="shopcart"></shopcart>
    </div>
</template>
<script>
    import BScroll from 'better-scroll'
    import shopcart from '../shopcart/shopcart.vue'
    import cartcontrol from '../cartcontrol/cartcontrol.vue'
    var ERR_OK = 0;
export default {
    props:{
        seller:{}
    },
    data(){
        return{
            goods:[],
            listHeight:[],
            scrollY:0,  //存放滑动高度
            classMap:[]
        };
    },
    components:{
        shopcart,cartcontrol
    },
    created(){
        this.classMap=['decrease','discount','guarantee','invoice','special']
        this.$http.get('/api/goods').then((response) =>{
            response = response.body;
            if(response.errno == ERR_OK){
                this.goods = response.data;
                this.$nextTick(() => {
                    this._initScroll();
                    this._calculateHeight();
                }) 
            };
        });
    },
    computed:{
        currentIndex(){
            for(var i = 0;i < this.listHeight.length;i++){
                var height1 = this.listHeight[i];
                var height2 = this.listHeight[i + 1];
                if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){  
                    return i;
                }
            }
            return 0;
        },
        selectFoods(){  //点击左边菜单右边显示相应的位置
            var foods = [];
            this.goods.forEach((good) =>{
                good.foods.forEach((food) =>{
                    if(food.count){
                        foods.push(food);
                    }
                });
            });
            return foods;
        }
    },
    methods:{
        _initScroll(){
            this.meunScroll = new BScroll(document.getElementById('menuwrapper'),{
                click:true  //允许点击
            }); //起滚动作用
            this.foodScroll = new BScroll(document.getElementById('foodwrapper'),{
                probeType:3,  //允许监听位置
                click:true
            });
            this.foodScroll.on('scroll',(pos) => {   //监听
                this.scrollY = Math.abs(Math.round(pos.y));
            })
        },
        _calculateHeight(){
            var foodList = document.getElementsByClassName('food-list-hook');
            var height = 0;
            this.listHeight.push(height);
            for(var i = 0;i < foodList.length;i++){
                var item = foodList[i];
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        },
        selectMenu(index,event){
            if(!event._constructed){  //自己派发的点击事件含有_constructed属性，而浏览器原生的点击事件是没有_constructed属性的
                return;  //如果是浏览器原生的点击事件则return
            }
            var foodList = document.getElementsByClassName('food-list-hook');
            var el = foodList[index];
            this.foodScroll.scrollToElement(el,300);
        },
        cartAdd(target){
            this.$nextTick(() => {
                this.$refs['shopcart'].drop(target); //调用子组件shopcart中的drop方法
            });
        }
    }
    // events:{
    //     'cart.add'(target){ //接受传来的事件
    //         this._drop(target);
    //         console.log(target);
    //     }
    // }
}
</script>
<style lang="stylus">
    @import '../../common/stylus/mixin';
    .goods
        display flex
        position absolute
        width 100%
        top 168px
        bottom 46px
        overflow hidden
        .menu-wrapper
            flex 0 0 80px  // 不等分  占位缩放   占位空间
            width 80px
            background #f3f5f7
            .menu-item
                display table
                height 54px
                width 56px
                padding 0 12px
                line-height 14px
                &.current
                    position relative
                    z-index 10
                    margin-top -1px
                    font-weight 700
                    background #fff
                    .text
                        border-none()
                .icon
                    display inline-block
                    vertical-align top
                    width 12px
                    height 12px
                    margin-right 2px
                    background-size 12px 12px
                    background-repeat no-repeat
                    display relative 
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')
                    &.guarantee
                        bg-image('guarantee_3')
                    &.invoice
                        bg-image('invoice_3')
                    &.special
                        bg-image('special_3')
                .text
                    display table-cell
                    width 56px
                    vertical-align middle
                    border-1px(rgba(7,17,27,0.1))
                    font-size 12px
        .foods-wrapper
            flex 1
            .title
                padding-left 14px
                height 26px
                line-height 26px
                border-left 2px solid #d9dde1
                font-size 12px
                color rgb(147,152,159)
                background #f3f5f7
            .food-item
                display flex
                margin 18px
                padding-bottom 18px
                border-1px(rgba(7,17,27,0.1))
                &.lsat-child
                    border-none()
                    margin-bottom 0
                .icon
                    flex 0 0 57px
                    margin-right 10px
                .content
                    flex 1
                    .name
                        font-size 14px
                        height 14px
                        line-height 14px
                        margin 2px 0 8px 0
                        color rgb(7,17,27)
                    .desc,.extra
                        line-height 10px
                        font-size 10px
                        color rgb(147,153,159)
                    .desc
                        margin-bottom 8px
                        &.count
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
                .crartcontrol-wrapper
                    position absolute
                    right 0
                    bottom 12px
</style>

