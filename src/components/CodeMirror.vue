<template>
	<div class="code-box"><codemirror ref="mycode" :value="curCode" :options="cmOptions" class="code-codemirror"></codemirror></div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
// 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
// import 'codemirror/theme/idea.css';
import 'codemirror/theme/3024-day.css';
// 这里引入的模式的js，根据设置的mode引入，一定要引入！！
// require('codemirror/mode/javascript/javascript');
require('codemirror/mode/vue/vue');
// 引入不同文件的转义代码
import MapCanvasCode from '@a/file/code/MapCanvas.js';
export default {
	name: 'CodeMirror',
	components: {
		codemirror
	},
	data() {
		return {
			curCode:
				'CodeMirror is a versatile text editor implemented in JavaScript for the browser. It is specialized for editing code, and comes with over 100 language modes and various addons that implement more advanced editing functionality. Every language comes with fully-featured code and syntax highlighting to help with reading and editing complex code.',
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
			}
		};
	},
	mounted() {
		this.initData();
	},
	methods: {
		initData() {
			var self = this;
			switch (self.$route.query.code) {
				case 'MapCanvasCode':
					self.curCode = MapCanvasCode;
					break;
				default:
					self.curCode =
						'CodeMirror is a versatile text editor implemented in JavaScript for the browser. It is specialized for editing code, and comes with over 100 language modes and various addons that implement more advanced editing functionality. Every language comes with fully-featured code and syntax highlighting to help with reading and editing complex code.';
					break;
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
