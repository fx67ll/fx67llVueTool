<template>
	<div class="code-box">
		<codemirror ref="mycode" :value="curCode" :options="cmOptions" class="code-codemirror"></codemirror>
		<!-- <div class="code-btn"><span @click="getCode">获取转义代码</span></div> -->
	</div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
// import 'codemirror/theme/idea.css'; // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
import 'codemirror/theme/3024-day.css';
// require('codemirror/mode/javascript/javascript'); // 这里引入的模式的js，根据设置的mode引入，一定要引入！！
require('codemirror/mode/vue/vue');
import MapCanvasCode from '@a/file/MapCanvas.js';
export default {
	name: 'Test',
	components: {
		codemirror
	},
	data() {
		return {
			// curCode: MapCanvasCode,
			curCode: '',
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
	methods: {
		// 目前的转义字符获取非常低效，实际上是手动在页面上通过打印的方式再存储为字符串文件，后期通过前端工具或者上传后端处理的方式通用的批量返回
		getCode() {
			var self = this;
			console.log(JSON.stringify(self.$refs.mycode.content));
		}
	}
};
</script>

<style lang="less" scoped="scoped">
/deep/ .CodeMirror {
	height: 100% !important;
	// background-color: transparent !important;
}
.code-box {
	width: 100%;
	height: 100%;
	.code-codemirror {
		width: 100%;
		height: 100%;
	}
	.code-btn {
		position: absolute;
		top: 60px;
		right: 30px;
		border: 1px solid #42b983;
		box-shadow: 1px 1px 5px #f8f8f8;
		z-index: 999;
		span {
			display: inline-block;
			padding: 4px;
			color: #42b983;
			border: 1px solid #42b983;
			.ban-user-select();
		}
		span:hover {
			background-color: #42b983;
			color: #ffffff;
		}
	}
}
</style>
