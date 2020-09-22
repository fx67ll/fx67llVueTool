<template>
	<div class="fx67ll-box">
		<div class="fx67ll-title">fx67ll</div>
		<div class="fx67ll-link">
			<span>简易的canvas地图渐变色区域绘制工具</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'fx67llIndex',
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="less" scoped="scoped">
.fx67ll-box {
	width: 100%;
	height: 100%;
	.no-select();
	.fx67ll-title {
		width: 100%;
		padding: 20px 0;
		color: rgb(186, 186, 186, 1);
		font-size: 40px;
		text-align: center;
		font-family: 'PFR';
	}
	.fx67ll-link{
		width: 100%;
		padding: 50px 100px;
		span{
			display: inline-block;
		}
		span:hover{
			color: #42B983;
		}
	}
}
</style>
