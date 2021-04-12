<template>
	<div class="code-box">
		<codemirror ref="mycode" :value="curCode" :options="cmOptions" class="code-codemirror"></codemirror>
		<div class="code-btn" v-show="isDev"><span @click="getCode">获取转义代码</span></div>
	</div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
// import 'codemirror/theme/idea.css'; // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
import 'codemirror/theme/3024-day.css';
// require('codemirror/mode/javascript/javascript'); // 这里引入的模式的js，根据设置的mode引入，一定要引入！！
require('codemirror/mode/vue/vue');
import MapCanvasCode from '@a/file/code/MapCanvas.js';
export default {
	name: 'Test',
	components: {
		codemirror
	},
	data() {
		return {
			// curCode: MapCanvasCode,
			curCode: 'Powered By CodeMirror!\nhttps://codemirror.net\n\nThanks "Marijn Haverbeke" !!!\nhttps://github.com/marijnh',
			cmOptions: {
				value: '',
				// mode: 'text/javascript',
				mode: 'text/x-vue', // 这里的模式设置，请查看源码中mode下的index.html，那里有分发链接
				// theme: 'idea',
				theme: '3024-day',
				smartIndent: true, // 智能缩进
				lineNumbers: true,
				lineWrapping: true, // 代码过长换行而不是显示滚动条，默认是false显示滚动条
				lineWiseCopyCut: true,
				scrollbarStyle: null, // 隐藏滚动条，默认是native默认样式的滚动条
				readOnly: false
			},
			isShowBtn: false
		};
	},
	computed: {
		// 判断是否是开发环境，以决定是否显示获取转义字符的按钮，不然每次都需要注释掉再发布简直反人类
		isDev() {
			return process.env.VUE_APP_ENV === 'development';
		}
	},
	methods: {
		// 目前的转义字符获取非常低效，实际上是手动在页面上通过打印的方式再存储为字符串文件，后期通过前端工具或者上传后端处理的方式通用的批量返回
		getCode() {
			var self = this;
			if (JSON.stringify(self.$refs.mycode.content).length > 2) {
				console.log(JSON.stringify(self.$refs.mycode.content));
			} else {
				console.log('您还没输入测试代码~');
			}
		}
	}
};
</script>

<style lang="less" scoped="scoped">
/deep/ .CodeMirror {
	height: 100% !important;
	// background-color: transparent !important;
}
</style>
