<template>
	<div class="ndoe-box">
		<el-row class="ndoe-btnbox">
			<el-button @click="handleQuery">查询按钮</el-button>
			<el-button @click="handleAdd" type="primary">增加按钮</el-button>
			<el-button type="info">修改按钮</el-button>
			<el-button type="danger">删除按钮</el-button>
		</el-row>
		<el-row>
			<el-table :data="tableData">
				<el-table-column prop="logo" label="logo"></el-table-column>
				<el-table-column prop="title" label="标题"></el-table-column>
				<el-table-column prop="detail" label="内容"></el-table-column>
				<el-table-column prop="price" label="价格"></el-table-column>
				<el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width"><template slot-scope="scope"></template></el-table-column>
			</el-table>
		</el-row>
	</div>
</template>

<script>
import axios from 'axios';
export default {
	name: 'testnode',
	data() {
		return {
			tableData: []
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		getList() {
			axios({
				method: 'get',
				url: '/classe/getClassList'
			}).then(res => {
				this.tableData = res.data.result[0].classList;
			});
		},
		handleQuery() {
			this.getList();
		},
		handleAdd() {
			axios
				.post('/classe/addClass', {
					logo: 'ez13',
					title: 'Hello MongoDB!',
					detail: '学习',
					price: '0'
				})
				.then(res => {
					console.log(res);
					this.getList()
				});
		}
	}
};
</script>

<style lang="less" scoped>
.ndoe-box {
	width: 70%;
	height: 100%;
	margin: 0 auto;
	.ndoe-btnbox {
		padding: 40px 0 20px 0;
	}
}
</style>
