import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import less from 'less'
Vue.use(less)

new Vue({
  render: h => h(App),
}).$mount('#app')
