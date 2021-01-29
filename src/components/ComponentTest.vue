<template>
	<div class="component-box">
		<!-- <MapCanvas :mapzoom="15" :strokeWidth="20" :strokeColor="mapcanvas.strokeColor" :shadowStyle="mapcanvas.shadowStyle" :fillStyle="mapcanvas.fillStyle"></MapCanvas> -->
		<SplitArea :searchLevel="splitarea.searchLevel" :subsNum="splitarea.subsNum" :strokeStyle="splitarea.strokeStyle" :fillStyle="splitarea.fillStyle"></SplitArea>
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
			// splitarea组件测试参数
			splitarea: {
				searchLevel: 3,
				subsNum: 1,
				strokeStyle: {
					sShow: true,
					isShowSubs: true,
					style: {
						strokeColor: '#0091ea',
						strokeWeight: 5,
						strokeLine: 'solid',
						strokeOpacity: 0.99,
						strokeDasharray: [0]
					}
				},
				fillStyle: {
					isShow: true,
					style: {
						fillColor: '#80d8ff',
						fillOpacity: 0.29,
						hoverOpcity: 0.69 
					}
				}
			},
			// mapcanvas组件测试参数
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
