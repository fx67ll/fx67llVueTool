import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import less from 'less'
Vue.use(less)

import router from './router/index.js'

import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodeMirror)

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
