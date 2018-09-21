import Router from 'vue-router'

import goods from '../components/goods/goods'
import seller from '../components/seller/seller'
import ratings from '../components/ratings/ratings'

export default new Router({
    routes: [
        { path: '/goods', component: goods },
        { path: '/seller', component: seller },
        { path: '/ratings', component: ratings },
        {path:'/',redirect:'goods'}
    ]
})