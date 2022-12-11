import Vue from 'vue'
import App from './App'
import store from '@/store'

Vue.config.productionTip = false

App.mpType = 'app'

console.log(store)
const app = new Vue({
  ...App,
  store,
  router: ROUTES,
})
app.$mount()
