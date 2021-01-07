<!-- @name: MapCanvas -->
<!-- @author: fx67ll -->
<!-- @version: 1.0.0-->
<!-- @description：基于高德地图的行政区划工具，需要在引入高德地图api的同时引入AMap.DistrictSearch插件，格式：https://webapi.amap.com/maps?key=你的秘钥&v=1.4.15&plugin=AMap.DistrictSearch-->
<!-- @bug: 目前暂无发现bug，欢迎提供 -->

<template>
	<div class="map">
		<!-- <div class="tool-container"><div @click="showCode">查看代码</div></div> -->
		<div class="tool-container"><div class="inDev">该组件开发中，尚不提供源码查看</div></div>
		<div id="map-container" ref="map"></div>
	</div>
</template>

<script>
import _ from 'underscore';

export default {
	name: 'Map',
	data() {
		return {
			AMap: null // 地图对象
		};
	},
	props: {
		// 地图的发布样式
		mapstyle: {
			type: String,
			required: false,
			validator(value) {
				return value.substring(0, 6) === 'amap://';
			}
		},
		// 地图中心点，保留6位小数的经纬度数组
		mapcenter: {
			type: Array,
			required: false,
			default: function() {
				var arr = [118.779611, 32.016625];
				return arr;
			},
			validator(arr) {
				var lngreg = new RegExp('^-?((0|1?[0-7]?[0-9]?)(([.][0-9]{1,6})?)|180(([.][0]{1,6})?))$');
				var latreg = new RegExp('^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,6})?)|90(([.][0]{1,6})?))$');
				if (lngreg.test(arr[0]) && latreg.test(arr[1])) {
					return true;
				} else {
					return false;
				}
			}
		},
		// 地图的初始化缩放比例，2D模式下只能是int，在3D模式下的高德地图传入float才会生效
		mapzoom: {
			type: Number,
			required: false,
			default: 13,
			validator(num) {
				var intreg = new RegExp('^[0-9]*[1-9][0-9]*$');
				if(intreg.test(num)){
					return num > 2 && num < 19;
				} else {
					return false;
				}
			}
		},
		// 查询级别，1国家，2省份，3市，4区县，默认显示整个中国的地图
		searchLevel: {
			type: Number,
			required: false,
			default: 1,
			validator(num) {
				var intreg = new RegExp('^[0-9]*[1-9][0-9]*$');
				if(intreg.test(num)){
					return num > 0 && num < 5;
				} else {
					return false;
				}
			}
		}
	},
	mounted() {
		this.mapInit();
	},
	methods: {
		// 初始化地图
		mapInit() {
			var self = this;
			self.AMap = new AMap.Map('map-container', {
				center: self.mapcenter,
				zoom: self.mapzoom
			});

			if (self.mapstyle !== '' && self.mapstyle !== null && self.mapstyle !== undefined) {
				self.AMap.setMapStyle(self.mapstyle);
			}

			self.drawArea();
		},
		// 绘制不同行政区域
		drawArea() {
			var self = this;

			var district = null;
			var polygons = [];
			// 需要加载行政区划插件
			// https://webapi.amap.com/maps?key=a3905d3985de06d3cf69aa47435a96f8&v=1.4.15&plugin=Map3D,AMap.DistrictSearch
			// 在
			// 实例化DistrictSearch
			var opts = {
				showbiz: false,
				// 是否显示商圈，没有什么大影响，默认是true，本组件保留功能，但是默认不显示
				level: 'country',
				// 查询行政级别为 country province city district 区县为最后一级，返回street街道但是arcode不再更新，最后画的级别只能到district
				// 若有特殊需求要查询商圈之类，可详细查询高德官方文档，本组件保留功能，但是默认不查询
				extensions: 'all',
				// 是否返回行政区边界坐标点，默认base不返回行政区边界坐标点，all返回行政区边界坐标组等具体信息
				subdistrict: 0
				// 显示下级行政区级数，0：不返回下级行政区；默认1：返回下一级行政区；2：返回下两级行政区；3：返回下三级行政区；
			};
			district = new AMap.DistrictSearch(opts);
			//行政区查询
			district.setLevel('district');
			district.setSubdistrict(1);
			district.search('340503', function(status, result) {
				// console.log(result.districtList);
				self.AMap.remove(polygons); //清除上次结果
				polygons = [];
				var bounds = result.districtList[0].boundaries;
				if (bounds) {
					for (var i = 0, l = bounds.length; i < l; i++) {
						//生成行政区划polygon
						var polygon = new AMap.Polygon({
							strokeWeight: 1,
							path: bounds[i],
							fillOpacity: 0.4,
							fillColor: '#80d8ff',
							strokeColor: '#0091ea'
						});
						polygon.on('mouseover', function() {
							polygon.setOptions({
								fillOpacity: 0.8
							});
						});
						polygon.on('mouseout', function() {
							polygon.setOptions({
								fillOpacity: 0.4
							});
						});
						polygons.push(polygon);
					}
				}
				self.AMap.add(polygons);
				self.AMap.setFitView(polygons); //视口自适应
			});
		},
		// 显示当前组件源码
		showCode() {
			this.$router.push({
				path: '/code',
				query: {
					code: 'MapCanvasCode'
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.ban-user-select {
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Chrome/Safari/Opera */
	-khtml-user-select: none; /* Konqueror */
	-moz-user-select: none; /* Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently not supported by any browser */
}

.map {
	width: 100%;
	height: 100%;
	position: relative;
	color: #42b983;
	#map-container {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.tool-container {
		position: absolute;
		top: 20px;
		left: 30px;
		z-index: 1000;
		// border: 1px solid #42b983;
		border: 1px solid #ef8e81;
		box-shadow: 1px 1px 5px #f8f8f8;
		div {
			cursor: pointer;
			padding: 4px;
			border: 1px solid #42b983;
			.ban-user-select();
		}
		div:hover {
			background-color: #42b983;
			color: #ffffff;
		}
		.inDev {
			color: #ef8e81;
			border: 1px solid #ef8e81;
		}
		.inDev:hover {
			background-color: #ef8e81;
			color: #ffffff;
		}
	}
}
</style>
