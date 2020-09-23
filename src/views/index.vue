<template>
	<div class="fx67ll-box">
		<div class="fx67ll-title"><span @click="linktoFx67ll">fx67ll</span></div>
		<div class="fx67ll-link">
			<router-link tag="span" to="/mapcanvas">基于高德地图的简易canvas渐变色区域绘制工具</router-link>
			<!-- <router-link tag="span" to="/test">测试页面</router-link> -->
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
	methods: {
		linktoFx67ll() {
			// window.open('https://fx67ll.com');
			console.log('####### #     #  #####  ####### #       #     \n#        #   #  #     # #    #  #       #       \n#         # #   #           #   #       #       \n#####      #    ######     #    #       #       \n#         # #   #     #   #     #       #\n#        #   #  #     #   #     #       #\n#       #     #  #####    #     ####### ####### ');
		}
	}
};
</script>

<style lang="less" scoped="scoped">
.fx67ll-box {
	width: 100%;
	height: 100%;
	.no-select();
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
		span {
			display: inline-block;
			width: 100%;
			margin-bottom: 20px;
			font-size: 24px;
		}
		span:hover {
			color: #42b983;
		}
	}
	.fx67ll-footer {
		width: 100%;
		padding: 20px 0;
		text-align: center;
		position: absolute;
		bottom: 0;
	}
}
</style>
