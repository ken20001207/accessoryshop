import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import Vuex from 'vuex'

Vue.use(Vuex)
Vue.use(ElementUI);
Vue.use(VueRouter);

Vue.config.productionTip = false

import landing from "./components/landing.vue"
import classpage from "./components/classpage.vue"
import itempage from "./components/itempage.vue"
import checkout from "./components/checkout.vue"
import order from "./components/order.vue"

const routes = [
  { path: '/', component: landing },
  { path: '/classpage/:classid', component: classpage },
  { path: '/itempage/:itemid', component: itempage },
  { path: '/checkout', component: checkout },
  { path: '/order/:orderid', component: order }
]

// Vuex 購物車資料存儲
const store = new Vuex.Store({
  state: {
    shoppingcart: []
  },
  mutations: {
    // 加入商品到購物車
    additem(state, payload) {
      var find = false;
      state.shoppingcart.forEach(item => {
        if (item.id == payload.item.id && item.option == payload.option) {
          item.num += payload.num;
          localStorage.setItem("shoppingcart", JSON.stringify(state.shoppingcart));
          find = true;
        }
      })
      if (!find) {
        state.shoppingcart.push(
          {
            id: payload.item.id,
            option: payload.option,
            name: payload.item.name,
            num: payload.num,
            price: payload.item.price,
            sumprice: payload.item.price * payload.num
          }
        )
        localStorage.setItem("shoppingcart", JSON.stringify(state.shoppingcart));
      }
    },
    // 複寫購物車資料
    update(state) {
      state.shoppingcart = JSON.parse(localStorage.getItem("shoppingcart"));
    },
    // 刪除購物車物品
    delitem(state, payload) {
      var index = 0;
      state.shoppingcart.forEach(item => {
        if (item.id == payload.item.id && item.option == payload.item.option) {
          state.shoppingcart.splice(index, 1);
          localStorage.setItem("shoppingcart", JSON.stringify(state.shoppingcart));
          return;
        }
        index++;
      })
    },
    // 變更商品數量
    changeAmount(state, payload) {
      state.shoppingcart.forEach(item => {
        if (item.id == payload.item.id && item.option == payload.item.option) {
          item.num = payload.amount;
          localStorage.setItem("shoppingcart", JSON.stringify(state.shoppingcart));
          return;
        }
      })
    },
    // 清空購物車
    clean(state) {
      state.shoppingcart = [];
    }
  }
})

const router = new VueRouter({
  routes
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
