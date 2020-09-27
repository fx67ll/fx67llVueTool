// 下面是一个js文件，用最简单最全的例子展示了全局数据 isShowbckbtn的声明以及改变的方法；
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
	state: {
		isShowbckbtn: false,
	},
	getters: {
		getisShowbckbtn(state) { // 方法名随意,主要是来承载变化的isShowbckbtn的值，下面mutations,actions里面的方法名也是随意定的
			return state.isShowbckbtn
		},
	},
	mutations: {
		setisShowbckbtn(state, value) {
			state.isShowbckbtn = value;
		}
	},
	actions: {
		selectisShowbckbtn(context, params) {
			context.commit('setisShowbckbtn', params.isShowbckbtn);
		}
	}
});
export default store;
