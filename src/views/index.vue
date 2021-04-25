<template>
	<div class="fx67ll-box">
		<div class="fx67ll-title"><span @click="linktoFx67ll">fx67ll</span></div>
		<div class="fx67ll-link">
			<div class="fx67ll-link-item"><router-link tag="span" to="/mapcanvas">CanvasMap Tool Based on GaoDeMap</router-link></div>
			<div class="fx67ll-link-item"><router-link tag="span" to="/splitarea">SpliteArea Tool Based on GaoDeMap</router-link></div>
			<div class="fx67ll-link-item"><router-link tag="span" to="/hellothree">Threejs Hello World</router-link></div>
			<div class="fx67ll-link-item"><router-link tag="span" to="/testthree">Threejs Test For The Miku</router-link></div>
			<div class="fx67ll-link-item"><router-link tag="span" to="/testthree-FBX">Threejs Test For The FBX-Loader</router-link></div>
			<div class="fx67ll-link-item">
				<span><a target="_blank" href="http://three.fx67ll.com">Threejs Test For Medical Model Morph Animation</a></span>
			</div>
			<div class="fx67ll-link-item">
				<span><a target="_blank" href="http://node.fx67ll.com">Nodejs Login/Register/CRUD Powered By Express & MongoDB</a></span>
			</div>
			
			<!-- 不需要Nodejs的内置测试页面了，原页面留着暂时不继续开发了 -->
			<!-- <div class="fx67ll-link-item" v-show="isDev"><router-link tag="span" to="/testnode">Nodejs Test Interface Based on Express & MongoDB</router-link></div> -->

			<!-- 404演示页面，感觉放出来没什么意义，就不放了 -->
			<!-- <div class="fx67ll-link-item">
				<span><a target="_blank" href="http://404.fx67ll.com">Good 404</a></span>
			</div> -->
			
			<div class="fx67ll-link-item">
				<span><a target="_blank" href="https://www.yuque.com/docs/share/50146b98-8656-40b5-bbf9-c008bb31530f?# 《fx67llVueUI》">fx67llVueUI</a></span>
				<span>&nbsp; | | &nbsp;</span>
				<span><a target="_blank" href="https://www.yuque.com/docs/share/66ee9f75-5135-445f-a997-b476a5f342bf?# 《fx67llQuickEcharts》">fx67llQuickEcharts</a></span>
			</div>
			<div class="fx67ll-link-item"><router-link tag="span" to="/test">Code Mirror</router-link></div>
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
			return process.env.VUE_APP_ENV === 'development';
		}
	},
	methods: {
		linktoFx67ll() {
			console.log(
				'####### #     #  #####  ####### #       #     \n#        #   #  #     # #    #  #       #       \n#         # #   #           #   #       #       \n#####      #    ######     #    #       #       \n#         # #   #     #   #     #       #\n#        #   #  #     #   #     #       #\n#       #     #  #####    #     ####### ####### '
			);
			window.open('https://fx67ll.xyz');
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
		// 	color: @green;
		// }
	}
	.fx67ll-link {
		max-height: calc(~'100% - 293px');
		overflow: auto;
		padding: 0 100px;
		margin: 50px 0;
		.fx67ll-link-item {
			width: 100%;
			margin-bottom: 25px;
			text-align: center;
			span {
				display: inline-block;
				font-size: 24px;
			}
			span:hover {
				color: @green;
			}
			a {
				text-decoration: none;
			}
		}
	}
}
</style>
