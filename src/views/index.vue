<template>
	<div class="fx67ll-box">
		<div class="fx67ll-title">
			<span @click="linktoFx67ll">fx67ll</span>
		</div>
		<div class="fx67ll-link">
			<div class="fx67ll-link-item"><router-link tag="span" to="/mapcanvas">CanvasMap Tool Based on GaoDeMap</router-link></div>
			<div class="fx67ll-link-item"><router-link tag="span" to="/splitarea">SpliteArea Tool Based on GaoDeMap</router-link></div>
			<div class="fx67ll-link-item"><router-link tag="span" to="/test">Code Test Tool</router-link></div>
			<div class="fx67ll-link-item" v-show="isDev"><router-link tag="span" to="/devtest">Component Test Tool</router-link></div>
		</div>
		<div class="fx67ll-footer">
			Designed & Powered by
			<a href="https://fx67ll.com" target="_blank">fx67ll</a>
			&#12288; Copyright© 2018-{{ this.year }}&#12288;
			<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">皖ICP备18017174号-2</a>
		</div>
	</div>
</template>

<script>
import moment from 'moment';
export default {
	name: 'fx67llIndex',
	data() {
		return {
			year: moment().format('YYYY')
		};
	},
	computed: {
		// 判断是否是开发环境，组件测试页面仅在开发环境开放
		isDev() {
			return process.env.VUE_APP_ENV === 'development'
		}
	},
	methods: {
		linktoFx67ll() {
			// window.open('https://fx67ll.com');
			console.log(
				'####### #     #  #####  ####### #       #     \n#        #   #  #     # #    #  #       #       \n#         # #   #           #   #       #       \n#####      #    ######     #    #       #       \n#         # #   #     #   #     #       #\n#        #   #  #     #   #     #       #\n#       #     #  #####    #     ####### ####### '
			);
		}
	}
};
</script>

<style lang="less" scoped="scoped">
.fx67ll-box {
	width: 100%;
	height: 100%;
	.ban-user-select();
	.fx67ll-title {
		width: 100%;
		padding: 36px 0;
		text-align: center;
		span {
			display: inline-block;
			font-size: 36px;
		}
		// span:hover {
		// 	color: #42b983;
		// }
	}
	.fx67ll-link {
		padding: 50px 100px;
		.fx67ll-link-item{
			width: 100%;
			margin-bottom: 25px;
			text-align: center;
			span {
				display: inline-block;
				font-size: 24px;
			}
			span:hover {
				color: #42b983;
			}
		}
	}
	.fx67ll-footer {
		width: 100%;
		padding: 20px 0;
		text-align: center;
		position: absolute;
		bottom: 0;
		user-select: text;
	}
}
</style>
