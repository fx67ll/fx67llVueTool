import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import less from 'less'
Vue.use(less)

import router from './router/index.js'

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
