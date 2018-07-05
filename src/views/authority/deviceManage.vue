<template>
	<section v-loading="bindingLoading">
		<div>
			<el-row class="device-title"><div class="grid-content">智能主机</div></el-row>
			<el-row class="device-single">
			  <el-col :span="5">
			  	<div class="grid-content device-icon">
			  		<img :src="hostpic" alt="">
			  	</div>
			  </el-col>
			  <el-col :span="7" v-if="!deviceManageObj['160fa2b44f472711160fa2b44f479601']">
			  	<span>未绑定，<a href="javascript:void(0)" @click="startBinding">请绑定</a></span>
			  </el-col>
			  <el-col :span="19">
			  	<el-col v-if="deviceManageObj['160fa2b44f472711160fa2b44f479601']" class="grid-content pull-right cancelBinding" :span="4" @click.native="delDeviceHost($event)" id="160fa2b44f472711160fa2b44f479601">
			  		<span class="close-area">
			  			<img :src="closepic" alt="">
			  		</span>
			  		<p class="cancel-binding">解绑</p>
			  	</el-col>
			  </el-col>
			</el-row>
			<!--绑定主机-->
			<el-dialog title="绑定智能主机" v-model="bindingVisible" :close-on-click-modal="false">
				<el-row class="main-area">
					<div class="upload">
						<el-button type="primary">上传设备二维码</el-button>
						<input id="file" ref="myFiles" class="hideEle" type="file" name="file" accept="image/jpeg,image/png,image/gif" @change="changeFile">
					</div>
					<el-input class="info-area" placeholder="暂未上传设备二维码" v-model="deviceinfo" :disabled="true"></el-input>
				</el-row>
				<el-button type="success" class="btn-add" @click="uploadFile">添加设备</el-button>
			</el-dialog>
		</div>
		<div>
			<el-row class="device-title"><div class="grid-content">智能门锁</div></el-row>
			<el-row class="device-single">
			  <el-col :span="5">
			  	<div class="grid-content device-icon">
			  		<img :src="doorpic" alt="">
			  	</div>
			  </el-col>
			  <el-col :span="7" v-if="!isBinding">
			  	<span>未绑定，<a href="javascript:void(0)" @click="startBinding">请绑定</a></span>
			  </el-col>
			  <el-col :span="19">
			  	<el-col v-if="isBinding" class="grid-content pull-right" :span="4">
			  		<span class="close-area">
			  			<img :src="closepic" alt="">
			  		</span>
			  		<p class="cancel-binding">解绑</p>
			  	</el-col>
			  </el-col>
			</el-row>
		</div>
		<div>
			<el-row class="device-title"><div class="grid-content">智能水表</div></el-row>
			<el-row class="device-single">
			  <el-col :span="5">
			  	<div class="grid-content device-icon">
			  		<img :src="watermeterpic" alt="">
			  	</div>
			  </el-col>
			  <el-col :span="7" v-if="!isBinding">
			  	<span>未绑定，<a href="javascript:void(0)" @click="startBinding">请绑定</a></span>
			  </el-col>
			  <el-col :span="19">
			  	<el-col v-if="isBinding" class="grid-content pull-right" :span="4">
			  		<span class="close-area">
			  			<img :src="closepic" alt="">
			  		</span>
			  		<p class="cancel-binding">解绑</p>
			  	</el-col>
			  </el-col>
			</el-row>
		</div>
		<div>
			<el-row class="device-title"><div class="grid-content">智能空开</div></el-row>
			<el-row class="device-single">
			  <el-col :span="5">
			  	<div class="grid-content device-icon">
			  		<img :src="airswitchpic" alt="">
			  	</div>
			  </el-col>
			  <el-col :span="7" v-if="!isBinding">
			  	<span>未绑定，<a href="javascript:void(0)" @click="startBinding">请绑定</a></span>
			  </el-col>
			  <el-col :span="19">
			  	<el-col v-if="isBinding" class="grid-content pull-right" :span="4">
			  		<span class="close-area">
			  			<img :src="closepic" alt="">
			  		</span>
			  		<p class="cancel-binding">解绑</p>
			  	</el-col>
			  </el-col>
			</el-row>
		</div>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, houseRemoveUser, batchRemoveHouse, editHouse, addHouse, getHouseList, toggleFunc, getBasicInfo, getSign, uploadAction, hostBinding, bindingDevice, getDevices, delHost, delLocalHost } from '../../api/api';

	export default {
		data() {
			return {
				deviceinfo: '',
				isclick: false,
				isBinding: false,
				bindingVisible: false,
				filters: {
					name: ''
				},
				hostpic: require('../../assets/device/host_nor.png'),
				doorpic: require('../../assets/device/door_nor.png'),
				airswitchpic: require('../../assets/device/airswitch.png'),
				watermeterpic: require('../../assets/device/watermeter.png'),
				closepic: require('../../assets/device/deletedevice.svg'),
				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				editLoading: false,
				bindingLoading: true,
				productObj: {},
				deviceManageObj: {
					'160fa2b44f472711160fa2b44f479601': 0,
					'12344': 0,
					'2233': 0,
					'4': 0
				},
				devices: [],
				ws: null,
				socketObj: null,//当前设备的类
				devicesList: []
			}
		},
		methods: {
			changeFile() {
	            let file = this.$refs.myFiles.files[0]; //获取file对象
	            this.deviceinfo = file.name;
	        },
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
					this.users.length = 0;
					res.data.rows.map(item => {
						this.users.push(item);
					})
					this.listLoading = false;
				});
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
			selsChange: function (sels) {
				this.sels = sels;
			},
			getUserPsw(){
				let para = {
					id: sessionStorage.getItem('houseId')
				}
				getBasicInfo(para).then((res) => {
					util.across(this, res);
					this.login(res.entity.account, res.entity.password);
				});
			},
			login(userName, password){
				let params = {
				    "email" : userName,
				    "corp_id":"100fa4b41cb5c000",
				    "password" : password
				}
				let para = JSON.stringify(params);
				getSign(para).then((res) => {
					util.across(this, res);
					sessionStorage.setItem('access_token', res.access_token);
					sessionStorage.setItem('refresh_token', res.refresh_token);
					sessionStorage.setItem('user_id', res.user_id);
					sessionStorage.setItem('authorize', res.authorize);
					this.getAllDevices();
				});
			},
			getAllDevices(){
				let config = {
					headers: { 'Access-Token': sessionStorage.getItem('access_token') }
				}
				getDevices(config).then((res) => {
					util.across(this, res);
					res.map(item => {
						this.productObj[item.product_id] = item.id;
						this.deviceManageObj[item.product_id] = 1;
					})
					this.devices = res.map((item) => {
                        return {
                            device_id: item.id.toString(),
                            device_name: item.name,
                            device_mac: item.mac,
                            device_pid: item.product_id
                        }
                    });
                    if(res.length>0){
                    	this.SetCookie("hostId", res[0].id);
                    }
					localStorage.setItem('productObj',JSON.stringify(this.productObj));
					this.initSdk();
					this.bindingLoading = false;
				});
				
			},
			delLocalHost(id){
				let _this = this;
				let param = {
	                id: id
	            }
	            delLocalHost(param).then(res => {
					_this.$message({
						message: '成功解绑主机',
						type: 'success'
					});
					localStorage.removeItem('productObj');
                    setTimeout(function() {
                        _this.$router.go(0);
                    }, 1500);
	            })
			},
			delDeviceHost(e){
				let _this = this;
				let id = this.productObj[e.currentTarget.id];
				let params = {
					"device_id": id
				}
				let config = {
					headers: { 'Access-Token': sessionStorage.getItem('access_token') }
				}
				this.$confirm('是否需要解除绑定?', '提示', {
					type: 'warning'
				}).then(() => {
					delHost(params, config).then((res) => {
						util.across(_this, res);
						this.delLocalHost(id);
					});
				}).catch(() => {

				});
			},
			startBinding(){
				this.bindingVisible = true;
			},
			uploadFile() {
	            if (this.isclick) return;
	            this.isclick = !this.isclick;
	            let file = this.$refs.myFiles.files[0]; //获取file对象
	            let param = new FormData(); //创建form对象  
	            param.append('file', file, file.name); //通过append向form对象添加数据
	            let config = {
	                headers: { 'Content-Type': 'multipart/form-data' }
	            };
	            uploadAction(param, config).then(res => {
	                this.addYzyEq(res.resultValue);
	            }).catch(error => {
	                console.log(error);
	            })
	        },
	        setHostType(res){
	        	let _this = this;
	            let param = {
	                deviceId: res.id || '',
	                houseId: sessionStorage.getItem('houseId'),
	                name: res.name || '',
	                deviceType: res.pid || '',
	                sn: res.sn || '',
	                mac: res.mac || '',
	                type: 1
	            }
	            bindingDevice(param).then(res => {
                    this.$message({
						message: '成功添加设备',
						type: 'success'
					});
                    setTimeout(function() {
                        _this.$router.go(0);
                    }, 1500);
	            })
	        },
	        addYzyEq(data) {
	            let _this = this;
	            let params = {
	                "qrcode": data
	            }
	            let newparams = JSON.stringify(params);
	            let config = {
	                headers: { 'Access-Token': sessionStorage.getItem('access_token') }
	            }
	            hostBinding(newparams, config).then(res => {

                	_this.setHostType(res);

	            }).catch(error => {
	            	if(error.response.app_result_key == 1) return;

	                let resText = error.response.data;

	                if (resText.error.error == "Access-Token Refresh") {
	                    // window.refreshToten();
	                    return false;
	                }

	                if (resText.error.error == "Access-Token Expired") {
	                    // window.refreshToten();
	                    return false;
	                }

	                if (resText.error.error == "has subscribe device") {
	                    this.$message({
							message: '已订阅设备,请刷新页面',
							type: 'error'
						});
	                    return false;
	                }

	                if (resText.error.msg == "device qrcode unvalid") {
	                    this.$message({
							message: '无效二维码,请刷新页面',
							type: 'error'
						});
	                    return false;
	                }

	                if (resText.error.msg == "device subscribe faild by scan mode.") {
	                    this.$message({
							message: '主机被其他人员绑定了,请刷新页面',
							type: 'error'
						});
	                    return false;
	                }
            	})
	        },
	        SetCookie(obj, cvalue) {
	            let name = cvalue.cname;
	            let value = cvalue.cvalue;
	            let days = cvalue.exdays;
	            let d = new Date();
	            d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
	            let expires = "expires=" + d.toGMTString();
	            document.cookie = encodeURI(name) + "=" + encodeURI(value) + ";" + expires + "; path=/";
	        },
	        GetCookie(obj, data) {
	            let cvalue = data.cvalue;
	            let name = encodeURI(cvalue) + "=";
	            let ca = document.cookie.split(';');
	            for (let i = 0; i < ca.length; i++) {
	                let c = ca[i].trim();
	                if (c.indexOf(cvalue) == 0) {
	                    this.state.cookieVals[cvalue] = c.substring(cvalue.length + 1, c.length);
	                    return;
	                }
	            }
	            return "";
	        },
	        getToken() {
	            let _this = this;
	            this.commit('GetCookie', { cvalue: 'user_id' });
	            this.commit('GetCookie', { cvalue: 'access_token' });
	            if (_this.state.cookieVals.user_id) {
	                let params = {
	                    email: '2018030619252147527@sslj.com',
	                    corp_id: '100fa4b41cb5c000',
	                    password: 'Znjj123456'
	                };
	                let curParams = JSON.stringify(params);
	                let config = {
	                    'Access-Token': _this.state.cookieVals.access_token
	                };
	                this.$axios.post('/v2/user_auth', curParams, config).then(response => {
	                    if (response.status == 200) {
	                        _this.SetCookie("access_token", response.data.access_token);
	                        _this.SetCookie("refresh_token", response.data.refresh_token);
	                        _this.SetCookie("user_id", response.data.user_id);
	                        _this.SetCookie("authorize", response.data.authorize);
	                        _this.getAllDevices();
	                    } else {

	                    }
	                }).catch(error => {
	                    alert("服务器返回数据错误");
	                })
	            } else {
	                _this.getAllDevices();
	            }
	        },
	        //sdk发送数据
	        changeSdkMsg(msg){
	        	let _this = this;
	        	console.log(_this);
				var dataArr = [{
			        index: 1, // 数据端点索引
			        value: msg, // 数据端点值
			        type: 7 // 这个要看文档上的数据端点的列表枚举，string为6
			    }];
			    _this.socketObj.emit('senddata', {
			        type: 'datapoint',
			        data: dataArr
			    }, function(res) {
			        if (res.status === 0) {

			        } else {
			            alert("发送失败,状态:" + res.status)
			        }
			    });
			},
			getSend() {
	            let _this = this;
	            let SN = _this.GetCookie("SN");
	            let opValue = `0800${SN}FE90`;
	            this.changeSdkMsg(opValue);
	        },
	        //获取所有设备
	        getSdkEqMsg() {
	            var opValue="080049982E11FE81";
				if(!GetCookie("SN")){
					opValue="0800FFFFFFFFFE81";
				}
				this.changeSdkMsg(opValue);
	        },
	        initSdk(){
	        	let _this = this;
				_this.ws = new XSDK('mqtt', {
					type: 'app',
					host: 'ws://118.190.126.197:1884/mqtt',
					userid: sessionStorage.getItem('user_id'), // 用户在云智易平台的user_id，通过获取OpenID接口获取
					authorize: sessionStorage.getItem('authorize'), // 用户在云智易平台的authorize，通过获取OpenID接口获取
					keepAliveInterval: 40, // 非必填，mqtt通讯时长，默认为40s，每40s发送ping请求
				});

				_this.ws.on('ready', function() {
					console.log('成功连上了');
					_this.ws && _this.ws.emit('adddevices', _this.devices) //_devices 表示用户绑定设备列表
				});

				_this.ws.on('devicesready', function(devicesArray) {
	                console.log(devicesArray[0]);
	                _this.state.socketObj = devicesArray[0];
	                _this.changeSdkMsg('0800FFFFFFFFFE9D');
	                _this.getListen();
	                _this.getSend();
	            })
			}
		},
		mounted() {
			this.getUsers();
			this.getUserPsw();
			if(JSON.parse(localStorage.getItem('productObj'))){
				this.initSdk();
			}
		}
	}

</script>

<style scoped>
	.el-table th>.cell, .el-table .cell {
		text-align: center!important;
	}
	.el-dialog--small {
		min-width: 400px!important;
	}
	.close-area {
		display: block;
	    background: #f8f8f8;
	    border: 1px solid #d1d1d1;
	    width: 48px;
	    height: 48px;
	    line-height: 44px;
	    text-align: center;
	    border-radius: 100%;
	    margin: auto;
	}
	.close-area img {
		vertical-align: middle;
	}
	.cancel-binding {
		line-height: 0;
		text-align: center;
	}
	.cancelBinding {
		cursor: pointer;
	}
	.cancelBinding:hover .cancel-binding{
		color: blue;
	}
	.device-single .device-icon{
	    text-align: center;
	    border-right: 1px solid #d1d1d1;
	    margin-right: 16px;
	}
	.device-single .device-icon img {
		width: 57px;
		height: 57px;
	}
	.device-title {
		height: 40px;
		line-height: 40px;
		color: #4a4a4a;
		background-color: #f8f8f8;
		margin-top: 22px;
	}
	.device-title .grid-content {
		padding: 4px 20px;
	}
	.device-single {
		height: 170px;
		background-color: #f8f8f8;
		padding: 40px 16px;
	}
	.info-area {
		width: 300px;
		float: left;
	}
	.main-area {
		width: 434px;
		margin: auto;
		text-align: center;
	}
	#file {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 9;
		cursor: pointer;
	}
	.upload {
		position: relative;
		float: left;
	}
	.btn-add {
		display: block;
		margin: 30px auto auto auto;
	}
</style>