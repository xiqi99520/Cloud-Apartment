<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed ? 'logo-collapse-width' : 'logo-width'">
				{{ collapsed ? '' : sysName }}
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner">欢迎，{{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native.prevent="synchronous">同步缓存</el-dropdown-item>
						<el-dropdown-item @click.native.prevent="handleModify">修改密码</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu  
					class="el-menu-vertical-demo" 
					:default-active="$route.path"
					:default-openeds="['1', '2']"
					@open="handleopen" 
					@close="handleclose" 
					@select="handleselect"
					unique-opened 
					router 
					v-show="!collapsed">
					<template v-for="(item,index) in menuList">
						<el-submenu :index="index == 0 ? '1' : '2'" v-if="item.children.length > 0">
							<template slot="title">
								<i :class="item.iconCls"></i>{{item.text}}
							</template>
							<el-menu-item 
								v-for="child in item.children" 
								:index="child.attributes.url" 
								:key="child.attributes.url">
									{{child.text}}
							</el-menu-item>
						</el-submenu>
						<el-menu-item
							v-if="item.children.length <= 0"
							:index="item.attributes.url">
							<i :class="item.iconCls"></i>
							{{item.text}}
						</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{$route.name}}</strong>
						<el-breadcrumb separator="/" class="breadcrumb-inner">
							<el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
								{{ item.name }}
							</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
				<!--修改密码-->
				<el-dialog title="修改密码" v-model="modifyVisible" :close-on-click-modal="false">
					<el-form :model="modifyForm" label-width="80px" :rules="modifyFormRules" ref="modifyForm">
						<el-form-item label="密码" prop="psw">
							<el-input v-model="modifyForm.psw" auto-complete="off"></el-input>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click.native="modifyVisible = false">取消</el-button>
						<el-button type="primary" @click.native="modifySubmit" :loading="modifyLoading">提交</el-button>
					</div>
				</el-dialog>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import { routerMenu, synchronousCache, loginout, modifyPsw } from '../api/api';
	export default {
		data() {
			return {
				sysName:'乐居智家公寓管理系统',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				listLoading: false,
				modifyVisible: false,
				modifyLoading: false,
				menuList: '',
				indexArr: [],
				sysUserName: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				modifyForm: {
					psw: ''
				},
				modifyFormRules: {
					psw: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					]
				},
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				
			},
			handleclose() {
				
			},
			handleselect: function (a, b) {
			},
			//显示编辑界面
			handleModify(){
				this.modifyVisible = true;
			},
			modifySubmit: function () {
				this.$refs.modifyForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认修改吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let params = Object.assign({}, this.modifyForm);
							let para = {
								id: sessionStorage.getItem('id'),
								password: params.password
							}
							modifyPsw(para).then((res) => {
								this.modifyLoading = false;
								this.$message({
									message: '修改成功',
									type: 'success'
								});
								this.$refs['modifyForm'].resetFields();
								this.modifyVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					loginout().then((res) => {
						if(res.data.app_result_key == 0){
							_this.$router.push('/login');
						}
					})
				}).catch(() => {

				});
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			},
			synchronous(){
				synchronousCache().then((res) => {
					if(res.data.app_result_key == 0){
						this.$message({
		                  message: '同步成功',
		                  type: 'success'
		                });
					}
				});
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
				this.sysUserAvatar = user.avatar || '';
			}
			routerMenu().then((res) => {
                sessionStorage.setItem('id', res.data.curUser.id);
				this.sysUserName = res.data.curUser.realname;
				this.menuList = res.data.resources;
				this.menuList.map(index => {
					this.indexArr.push(index);
				})
				this.listLoading = false;
			});

		}
	}

</script>

<style scoped lang="scss">
	@import '~scss_vars';
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-primary;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 230px;
				width: 230px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 230px;
				width: 230px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>