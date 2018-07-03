<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="createDate" label="创建时间" width="200" :formatter="format" sortable>
			</el-table-column>
			<el-table-column prop="houseType" label="户型" min-width="100" sortable>
			</el-table-column>
			<el-table-column label="操作" width="230">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="warning" size="small" @click="toUrl(scope.row)">设备管理</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="户型" prop="houseType">
					<el-input v-model="editForm.houseType" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>


		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="姓名" prop="houseName">
					<el-input v-model="addForm.houseName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="户型" prop="houseType">
					<el-input v-model="addForm.houseType" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeHouse, batchRemoveHouse, editHouse, addHouse, getHouseList, toggleFunc } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				addFormVisible: false,//新增界面是否显示
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					roleName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					remark: [
						{ required: true, message: '请输入描述内容', trigger: 'blur' }
					],
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: '',
					remark: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					houseName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					houseType: [
						{ required: true, message: '请输入描述内容', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					id: '',
					houseName: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
					adminId: sessionStorage.getItem('id'),
				}
				this.listLoading = true;
				getHouseList(para).then((res) => {
					util.across(this, res);
					this.total = res.data.total;
					this.users.length = 0;
					res.data.rows.map(item => {
						this.users.push(item);
					})
					this.listLoading = false;
				});
			},
			toUrl(data){
				sessionStorage.setItem('houseId', data.id);
				this.$router.push('/device');
			},
			formatter(val){
				return val.status ? '禁用' : '正常';
			},
			format(data){
				if(!data.createDate) return data.createDate;
				return new Date(data.createDate).format("yyyy-MM-dd hh:mm:ss");
			},
			disabled(row){
				let _this = this;
				_this.listLoading = true;
				let para = { 
					id: row.id,
					status: row.status == 0 ? 1 : 0
				};
				toggleFunc(para).then((res) => {
					util.across(this, res);
					_this.listLoading = false;
					//NProgress.done();
					_this.$message({
						message: res.slide_msg_message_key,
						type: 'success'
					});
					this.getUsers();
				});
			},
			toggle(index, row){
				if(row.status != 1){
					this.$confirm('确认禁用该管理员吗?', '提示', {
						type: 'warning'
					}).then(() => {
						this.disabled(row);
					}).catch(() => {

					});
				} else {
					this.disabled(row);
				}
			},
			//删除
			handleDel: function (index, row) {
				console.log(row.id);
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { id: row.id };
					removeHouse(para).then((res) => {
						util.across(this, res);
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let params = Object.assign({}, this.editForm);
							let para = {
								id: params.id,
								adminId: sessionStorage.getItem('id'),
								name: params.name,
								houseType: params.houseType
							}
							editHouse(para).then((res) => {
								util.across(this, res);
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let params = Object.assign({}, this.addForm);
							let para = {
								adminId: sessionStorage.getItem('id'),
								name: params.houseName,
								houseType: params.houseType
							}
							addHouse(para).then((res) => {
								util.across(this, res);
								this.addLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveHouse(para).then((res) => {
						util.across(this, res);
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style>
	.el-table th>.cell, .el-table .cell {
		text-align: center!important;
	}
</style>