<template>
	<div class="component-box">
		<!-- <MapCanvas :mapzoom="15" :strokeWidth="20" :strokeColor="mapcanvas.strokeColor" :shadowStyle="mapcanvas.shadowStyle" :fillStyle="mapcanvas.fillStyle"></MapCanvas> -->
		<SplitArea></SplitArea>
	</div>
</template>

<script>
import MapCanvas from '@v/Map/MapCanvas/MapCanvas.vue';
import SplitArea from '@v/Map/SplitArea/SplitArea.vue';
export default {
	components: {
		MapCanvas,
		SplitArea
	},
	data() {
		return {
			mapcanvas: {
				strokeColor: [
					{
						opacityPos: 0,
						strokeCo: '#ffff00'
					},
					{
						opacityPos: 0.8,
						strokeCo: '#00FFFF'
					}
				],
				shadowStyle: {
					shadowColor: '#DEDEDE',
					shadowBlur: 10,
					shadowOffsetX: 30,
					shadowOffsetY: 30
				},
				fillStyle: {
					isFill: true,
					fillColor: [
						{
							opacityPos: 0,
							fillCo: '#aaff7f'
						},
						{
							opacityPos: 0.8,
							fillCo: '#ffaa7f'
						}
					],
					gradientDirection: 'top-bottom'
				}
			}
		};
	}
};
</script>

<style lang="less" scoped="scoped">
.component-box {
	width: 100%;
	height: 100%;
	background-color: #ffffff;
}
</style>
