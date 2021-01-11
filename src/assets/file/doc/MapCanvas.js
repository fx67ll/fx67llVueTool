const MapCanvasDoc = {
	description: '基于高德地图的简易画布绘制工具',
	Attributes: [{
			param: 'tooltype',
			descrbition: '选择使用自定义工具或高德官方工具，高德官方工具的方法后期有空再写，这个属性先放这里没什么卵用',
			type: 'String',
			// chooseValue: 'custom/gaode',
			chooseValue: '---',
			defaultValue: 'custom',
		},
		{
			param: 'mapstyle',
			descrbition: '地图的发布样式，需要遵守高德官方格式',
			type: 'String',
			chooseValue: '---',
			defaultValue: '---',
		},
		{
			param: 'mapcenter',
			descrbition: '地图中心点，保留6位小数的经纬度数组',
			type: 'Array',
			chooseValue: '---',
			defaultValue: '[118.779611, 32.016625]',
		},
		{
			param: 'mapzoom',
			descrbition: '地图的初始化缩放比例，值为正整数',
			type: 'Number',
			chooseValue: '---',
			defaultValue: '13',
		},
		{
			param: 'strokeWidth',
			descrbition: '自定义工具所绘制的线条的宽度，值为正整数',
			type: 'Number',
			chooseValue: '---',
			defaultValue: '10',
		},
		{
			param: 'strokeColor',
			descrbition: `自定义工具所绘制的线条的颜色。
					  opacityPos表示当前颜色在当前线条中的位置，值为0~1之间保留一位小数的浮点数；
					  strokeCo表示当前位置的线条颜色，值为十六进制颜色码。`,
			type: 'Array',
			chooseValue: '---',
			defaultValue: `[
					{
						opacityPos: 0,
						strokeCo: '#ffff00'
					},
					{
						opacityPos: 0.2,
						strokeCo: '#55ff00'
					},
					{
						opacityPos: 0.4,
						strokeCo: '#ff5500'
					},
					{
						opacityPos: 0.6,
						strokeCo: '#ff0000'
					},
					{
						opacityPos: 0.8,
						strokeCo: '#5500ff'
					},
					{
						opacityPos: 1,
						strokeCo: '#00FFFF'
					}
				]`,
		},
		{
			param: 'shadowStyle',
			descrbition: `自定义工具所绘制的阴影样式。
					  shadowColor表示阴影的颜色，值为十六进制颜色码；
					  shadowBlur表示阴影的模糊级数，值为正整数；
					  shadowOffsetX表示返回形状与阴影的水平距离，值为正整数；
					  shadowOffsetY表示返回形状与阴影的垂直距离，值为正整数。`,
			type: 'Object',
			chooseValue: '---',
			defaultValue: `{
					shadowColor: '#D3D3D3',
					shadowBlur: 5,
					shadowOffsetX: 20,
					shadowOffsetY: 20
				}`,
		},
		{
			param: 'fillStyle',
			descrbition: `自定义工具所绘制的多边形的填充颜色。
					  isFill表示连接所有线段绘制封闭图形后是否需要填充，不填充的话可以直接传false，下面的属性也不会再验证；
					  fillColor表示填充的颜色，属性参考strokeColor；
					  gradientDirection示填充颜色的渐变方向。`,
			type: 'Object',
			chooseValue: 'gradientDirection可选值: left-top/left-bottom/right-top/right-bottom/middle-border/border-middle/top-bottom/bottom-top/left-right/right-left',
			defaultValue: `{
					isFill: true,
					fillColor: [
						{
							opacityPos: 0,
							fillCo: '#aaff7f'
						},
						{
							opacityPos: 0.2,
							fillCo: '#aaffff'
						},
						{
							opacityPos: 0.4,
							fillCo: '#ffff7f'
						},
						{
							opacityPos: 0.6,
							fillCo: '#ffaa7f'
						},
						{
							opacityPos: 0.8,
							fillCo: '#aaaa7f'
						},
						{
							opacityPos: 1,
							fillCo: '#ffaaff'
						}
					],
					gradientDirection: 'right-bottom'
				}`,
		}
	],
	Events: [],
	Methods: [],
	Slot: []
};

export default MapCanvasDoc;
