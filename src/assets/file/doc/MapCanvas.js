const MapCanvasDoc = [{
		param: 'tooltype',
		descrbition: '选择使用自定义工具或高德官方工具',
		type: 'String',
		chooseValue: 'custom/gaode',
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
		descrbition: '地图的初始化缩放比例',
		type: 'Number',
		chooseValue: '---',
		defaultValue: '13',
	},
	{
		param: 'strokeWidth',
		descrbition: '自定义工具所绘制的线条的宽度',
		type: 'Number',
		chooseValue: '---',
		defaultValue: '10',
	},
	{
		param: 'strokeColor',
		descrbition: '自定义工具所绘制的线条的颜色，如果只想用一种颜色，那可以去用高德自带的画图工具，没有必要使用自定义的canvas画图工具',
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
		descrbition: '自定义工具所绘制的阴影样式',
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
		descrbition: '自定义工具所绘制的多边形的填充颜色，默认填充。不需要填充可以设置isFill为false，下面的属性也不会再验证',
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
];

export default MapCanvasDoc;
