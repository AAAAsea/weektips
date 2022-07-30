<template>
	<view class="main_index">
		<uni-navbar
			title="WeekTips"
		>
		</uni-navbar>
		<view class="content" :data-theme="this.$store.state.appTheme" :class="{'hide': hide || firstHide}">
			<scroll-view class="left" scroll-y>
				<scroll-view :class="{weeks:true,input:textareaWrite}">
					<view  class="boxl" v-for="item in week" :key="item.id" :class="{active:item.id==selectItem}" @click="changeSelect(item.id)">
						{{item.name}}
						<view class="redPoint" v-if="item.status"></view>
						<hr :style = "{display: (item.id == 7 ? 'none' : '')}"/>
					</view>
				</scroll-view>
				<view :class="{btns:true,btntop:textareaWrite}" :style="{bottom: this.keyboardHeight}">
					<button class='btn' hover-start-time=0 type="primary"  @click="cloud">☁</button>
					<button class='btn' hover-start-time=0 type="primary"  @click="changeSelect(today.toString())">今日</button>
					<button class='btn' hover-start-time=0 type="primary"  @click="copy">复制</button>
					<button class='btn' hover-start-time=0 type="primary"  @click="adjust">整理</button>
					<button class='btn' hover-start-time=0 type="primary"  @click="clear">清空</button>
				</view>
			</scroll-view>
			<scroll-view 
			:class="{right: true}" 
			scroll-y 
			id='right'
			:scroll-top="scrollTop"
			scroll-with-animation
			>
				<view class="title">
					周{{"一二三四五六日"[this.selectItemForTransition-1]}}<!-- <uni-transition style="display: inline;" :mode-class="['fade']" :show="show" :duration="250" :key="'title'+selectItemForTransition">{{"一二三四五六日"[this.selectItemForTransition-1]}}</uni-transition> -->安排📑
				</view>
				<view style="color: #888;text-align: center;margin: 10rpx;"  v-if="modelTaskList.length == 0 && taskList.length == 0">
						点击右下角加号创建待办~
				</view>
				<uni-transition :mode-class="transitionType[$store.state.transitionTypeNumber]" :show="show" :duration="250" :key="selectItemForTransition">
		
				<hr v-if="modelTaskList.length > 0 || taskList.length > 0"/>
				<view v-for="item in modelTaskList" :key="selectItem+'model_'+item.id" class="label">
					<view class="checkbox">
						<checkbox
						:class="{checked:item.checked}"
						:checked="item.checked"
						@click="checkChanged(item)"
						/>
					</view>
					<view :class="{textarea: true, anima: !textareaWrite}" >
						<textarea
						disabled = true
						maxlength = 2000
						v-model:value="item.text" 
						auto-height
						:class="{checked: item.checked}"
						:adjust-position="false"
						confirm-type="done"
						/>
					</view>
				</view>
				
				<hr v-if="modelTaskList.length > 0"/>
				<view v-for="item in taskList" :key="String(item.id)+String(selectItem)" class="label">
					<view class="checkbox">
						<checkbox
						:class="{checked:item.checked}"
						:checked="item.checked"
						@click="checkChanged(item)"
						/>
					</view>
					<view :class="{textarea: true, anima: !textareaWrite}" >
						<textarea
						maxlength = 2000
						v-model:value="item.text" 
						placeholder="在这里输入内容..." 
						auto-height
						auto-blur
						:focus="item.focus"
						:class="{checked: item.checked}"
						:adjust-position="false"
						confirm-type="done"
						@keyboardheightchange="keyboardPush"
						@blur="lostFocus($event, item.id)"
						@focus="onFocus($event, item.id)"
						@input="onInput($event, item.id)"
						@linechange="lineChange"
						/>
					</view>
				</view>
				<hr v-if="taskList.length > 0"/>
				</uni-transition>
				<view :style="{height: keyboardHeight}"></view>
			</scroll-view>
			<view class="add" v-if="!textareaWrite">
				<image 
				src="../../static/pics/plus.png" 
				@click="addTask()"
				/>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				hide: true,
				firstHide: true,
				transitionType: [['fade'],['fade','zoom-in'],['fade','slide-right','zoom-in']],
				show:true,
				scrollTop:199,
				keyboardHeight: "0rpx",
				textareaWrite: false,//是否正在编辑
				// cursor: -1,
				// focus: false,
				today: '1',
				selectItem: "",
				selectItemForTransition: "",
				taskList: [
					{
						id: 0,
						text: "测试样例",
						checked: true,
						focus: false,
					}
				],
				modelTaskList: [
					{
						id: 0,
						text: "model",
						checked: true,
						focus: false,
					}
				],
				week: [
					{
						id: '1',
						name: '周一',
						status: false
					},
					{
						id: '2',
						name: '周二',
						status: false
					},
					{
						id: '3',
						name: '周三',
						status: false
					},
					{
						id: '4',
						name:'周四',
						status: false
					},
					{
						id: '5',
						name:'周五',
						status: false
					},
					{
						id: '6',
						name:'周六',
						status: false
					},
					{
						id: '7',
						name: '周日',
						status: false
					}			
				]
			}
		},
		watch: {
			// selectItemForTransition: function(val){
			// 	console.log(val)
			// }
		},
		//初始化selectItem，根据当前时间判断
		onLoad() {
			let d = new Date().getDay().toString()
			this.today = this.selectItem = (d == '0' ? '7' : d)
			this.selectItemForTransition = this.selectItem
			setTimeout(()=> {			
				uni.showToast({
					position:"bottom",
					icon: 	"none",
					title: "周"+"一二三四五六末"[this.selectItem-1]+"愉快~",
					duration: 700
				});}, 100);		
			this.$store.commit('SET_NAV_TAB')
		},
		onShow(){
			this.$store.commit('SET_NAV_TAB')
			// uni.setTabBarStyle({
			// 	backgroundColor: getApp().globalData.darkMode ? "#000000" : "#ffffff"
			// })
			this.getStorage()
			this.initRedPoint()
			this.hide = false;
		},
		onHide() {
			this.lostFocus()
		},
		onReady(){
			this.firstHide = false;
		},
		methods: {
			//行数变化
			lineChange(e){
				if(!this.textareaWrite)
				{return}
				console.log(e)
				if(this.keyboardHeight <= 0)
					return;
				// if(this.textareaWrite)
				// {
				// 	setTimeout(()=> {
				// 		this.scrollTop += e.detail.height
				// 	}, 100);
				// }
				this.scrollTop = e.target.offsetTop + e.detail.height*((e.detail.lineCount-2)/e.detail.lineCount)
				// this.scrollTop += e.detail.height*((e.detail.lineCount-2)/e.detail.lineCount) //-2是为了在上方留两行
			},
			//键盘弹出
			keyboardPush(e){
				if(e.detail.height <= 0)
				{
					// console.log("键盘收起")
					this.textareaWrite = false; //有时候会出错，在设置一些false以防万一
					return;
				}
				// console.log("键盘弹出")
				this.keyboardHeight = e.detail.height - 50 + "px"; //减去tabbar的高度，tabbar高度可以在pages.json里设置
				setTimeout(()=>{
					// console.log(e.target)
					if(this.textareaWrite)
						this.scrollTop = e.target.offsetTop;//等待键盘弹起来以后
				}, e.detail.duration * 1000);
			},
			//清除已完成的待办
			adjust(){
				uni.showModal({
				    title: 'Tip',
				    content: '确定清除周'+"一二三四五六末"[this.selectItem-1]+'已完成项？',
				    success: res => {
				        if (res.confirm) {
							
							//对于checked进行检查，true的删除
							let len = this.taskList.length;
							for(var i = 0; i < len; ++i)
							{ 
								if(this.taskList[i].checked)
								{
									this.taskList.splice(i,1)
									i--;
									len--;
								}
							}
							
							//保存并提示
							this.setStorage()
							uni.showToast({
								icon: "iconFlag",
							    title: "整理好啦~",
							    duration: 1000
							});
							
				        } else if (res.cancel) {
				            uni.showToast({
								icon: "none",
				                title: '留着也不错呢！',
				                duration:1000
				            });
				        }
				    }
				});
				this.initRedPoint()			
			},
			
			//增加待办
			addTask(){
				// console.log("add")
				if(this.taskList.length > 0 && this.taskList[this.taskList.length-1].text == "")
				{
					this.taskList[this.taskList.length-1].focus = true;
					return;
				}
				this.taskList.push({
					id:this.taskList.length,
					text:"",
					checked:false,
					focus:true //自动聚焦
				})
				// console.log(this.show,this.selectItemForTransition)
			},
			
			//获取本地存储
			getStorage(){
				//获取模板存储
				let res = uni.getStorageSync("model_"+this.selectItem)
				// console.log(res)
				//对于之前的存储格式进行转换
				if(typeof res == "string")
				{
					if(res[0] == '✅')
						res = res.substr(1);
					let taskListArr = res.split("\n✅")
					this.modelTaskList = []
					let index = 0
					taskListArr.forEach((e)=>{
						if(e != "")
						{
							this.modelTaskList.push({
								id:index++,
								text:e,
								checked:false,
								focus:false
							})
						}
					})
					uni.setStorage({
						key:"model_"+this.selectItem,
						data:this.modelTaskList,
					})
				}else{
					this.modelTaskList = res
					let index = 0;
					this.modelTaskList.forEach(task=>{
						task.id = index++;//给每个任务一个id，列表渲染要用作k
						task.focus = false; //确保不会切换看板的时候自动聚焦
					})
				}
				//获取正常存储
				res = uni.getStorageSync(this.selectItem)
				// console.log(res)
				//对于之前的存储格式进行转换
				if(typeof res == "string")
				{
					if(res[0] == '✅')
						res = res.substr(1);
					let taskListArr = res.split("\n✅")
					this.taskList = []
					let index = 0
					taskListArr.forEach((e)=>{
						if(e != "")
						{
							this.taskList.push({
								id:index++,
								text:e,
								checked:false,
								focus:false
							})
						}
					})
					uni.setStorage({
						key:this.selectItem,
						data:this.taskList,
					})
				}else{
					this.taskList = res
					let index = 0;
					this.taskList.forEach(task=>{
						task.id = index++;//给每个任务一个id，列表渲染要用作k
						task.focus = false; //确保不会切换看板的时候自动聚焦
					})
				}
				this.scrollTop = 0
			},
			
			//存储本地
			setStorage(){
				// console.log("setSorage")
				//去除空任务
				let len = this.taskList.length;
				for(let i = 0; i < len; ++i)
				{
					if(this.taskList[i].text.trim() == "")
					{
						this.taskList.splice(i, 1);
						len --;
					}else{
						this.taskList[i].text = this.taskList[i].text.trim()
					}
				}
				len = this.taskList.length;
				for(let i = 0; i < len; ++i)
				{
					this.taskList[i].id = i
				}
				uni.setStorageSync(this.selectItem, this.taskList);
			},
			setModelStorage(){
				//去除空任务
				// let len = this.modelTaskList.length;
				// for(let i = 0; i < len; ++i)
				// {
				// 	if(this.modelTaskList[i].text.trim() == "")
				// 	{
				// 		this.modelTaskList.splice(i, 1);
				// 		len --;
				// 	}else{
				// 		this.modelTaskList[i].text = this.modelTaskList[i].text.trim()
				// 	}
				// }
				// len = this.modelTaskList.length;
				// for(let i = 0; i < len; ++i)
				// {
				// 	this.modelTaskList[i].id = i
				// }
				uni.setStorageSync("model_"+this.selectItem,this.modelTaskList)
			},
			//点击复选框
			checkChanged(item){
				item.checked = !item.checked;
				this.setStorage()
				this.setModelStorage()
				this.initRedPoint()
			},
			
			//复制
			copy(){
				let tasks = ""
				this.taskList.forEach((e)=>{
					if(e.checked)
					{
						tasks += "✅"
					}else
					{
						tasks += "*️⃣"
					}
					tasks += (e.text + "\n")
				})
				
				uni.setClipboardData({
					data:tasks
				})
			},
			
			//设置红点状态
			initRedPoint(){
				this.week.forEach(e=>{
					let res1 = uni.getStorageSync("model_" + e.id)
					let res2 = uni.getStorageSync(e.id)
					let flag1 = false;
					let flag2 = false;
					if(res1.length > 0)
					{
						let len = res1.length;
						for(var i = 0; i < len; ++i)
						{
							if(res1[i].checked == false)//如果该天有任务没完成就显示红点
							{
								flag1 = true;
								break;
							}
						}
					}
					if(res2.length > 0)
					{
						let len = res2.length;
						for(var i = 0; i < len; ++i)
						{
							if(res2[i].checked == false)//如果该天有任务没完成就显示红点
							{
								flag2 = true;
								break;
							}
						}
					}
					e.status =(flag1 || flag2); //有一组没有完成就显示红点
					
				
				})
			},
			//恢复数据
			recover(){
				uni.getNetworkType({
					success: (res)=> {
						if(res.networkType == "none")
						{
							uni.showToast({
								icon: "error",
								title: "网络似乎..."
							})
						}else{
							if(!this.$store.state.hasLogin)
							{
								uni.navigateTo({
									url: "/pages/mine/login/login",
									animationType: 'slide-in-right',
									animationDuration: 200,
								})
								uni.showToast({
									icon: "error",
									title: "请先登录"
								})
								return
							}
							uni.showModal({
							    title: '提示',
							    content: '该操作将会把最近一次的上传记录取回本地并覆盖掉本地记录，确定要恢复？',
							    success: res => {
							        if (res.confirm) {
											uni.showLoading({
							            		title: "恢复中，请保持网络开启...",
												mask: true,
							            	})
											let flag = true
											setTimeout(function () {
											    if(flag)
												{
													uni.hideLoading();
													uni.showToast({
														icon: "none",
														title: "恢复可能超时",
														duration:3000,
														// position: "bottom"
													})
												}
											}, 3000);
							            	uniCloud.callFunction({
							            		name: "getRecord",
							            		data: {
							            			account: this.$store.state.userInfo.account,
							            			passwd: this.$store.state.userInfo.passwd,
							            			userId: this.$store.state.userInfo.userId,
							            			loginType: this.$store.state.loginType
							            		}
							            	}).then(res=>{
												// console.log(res)
							            		if(res.result.status)
							            		{
													flag = false
							            			for(var i in res.result.data)
							            			{
														//对于之前的存储格式进行转换
														if(typeof res.result.data[i] == "string")
														{
															if(res.result.data[i][0] == '✅')
																res.result.data[i] = res.result.data[i].substr(1);
															let taskListArr = res.result.data[i].split("\n✅")
															let taskList = []
															taskListArr.forEach((e)=>{
																if(e != "")
																{
																	taskList.push({
																		text:e,
																		checked:false
																	})
																}
															})
															uni.setStorageSync(i, taskList)
														}else{
															uni.setStorageSync(i, res.result.data[i])
														}
							            			}
							            			uni.setStorage({
							            				key: "account",
							            				data: this.$store.state.userInfo.account
							            			})
							            			uni.setStorage({
							            				key: "passwd",
							            				data: this.$store.state.userInfo.passwd
							            			})
													this.initRedPoint()
													this.taskList = uni.getStorageSync(this.selectItem)
													uni.hideLoading()
													uni.showToast({
														icon: "none",
														title: res.result.msg,
														duration:2000,
														// position: "bottom"
													})
							            		}else{
													uni.showToast({
														icon: "none",
														title: "恢复失败请重试",
														duration:2000,
														// position: "bottom"
													})
												}
												
							            })
							        } else if (res.cancel) {
							            uni.showToast({
							            	icon:"none",
							            	title:"已取消恢复"
							            })
							        }
							    }
							});
							
						}
					}
				});
				
			},
			//上传数据
			upload(){
				uni.getNetworkType({
					success: (res)=> {
						if(res.networkType == "none")
						{
							uni.showToast({
								icon: "error",
								title: "网络似乎..."
							})
						}else{
							if(!this.$store.state.hasLogin)
							{
								uni.navigateTo({
									url: "/pages/mine/login/login",
									animationType: 'slide-in-right',
									animationDuration: 200,
								})
								uni.showToast({
									icon: "error",
									title: "请先登录"
								})
								return
							}
							uni.showModal({
							    title: '提示',
							    content: '该操作将会把本地的计划上传云端并覆盖上一次的上传记录，确定要上传？',
							    success: res=> {
							        if (res.confirm) {
							            uni.showLoading({
							            	title: "上传中，请保持网络开启...",
											mask: true
							            })
										let flag = true
										setTimeout(function () {
										    if(flag)
											{
												uni.hideLoading();
												uni.showToast({
													icon: "none",
													title: "上传超时请重试",
													duration:3000,
													// position: "bottom"
												})
											}
										}, 3000);
										// console.log()
										let content = {}
										for(let i = 1; i <= 7; i++)
										{
											let j = i.toString()
											content[j] = uni.getStorageSync(j)
											let len = content[j].length
											for(let k = 0; k < len; ++k)
											{
												content[j][k].focus = false
											}
										}
							            uniCloud.callFunction({
							            	name: "signUp",
							            	data: {
							            		account: this.$store.state.userInfo.account,
							            		passwd: this.$store.state.userInfo.passwd,
												userId: this.$store.state.userInfo.userId,
							            		record: content,
												loginType: this.$store.state.loginType
							            	}
							            }).then(res=>{
											flag = false
							            	uni.hideLoading()
							            	uni.showToast({
							            		icon: "none",
							            		title: res.result.msg,
							            		duration:2000,
							            	})
							            })
							        } else if (res.cancel) {
							            uni.showToast({
											icon:"none",
							            	title:"已取消上传"
							            })
							        }
							    }
							});
							
						}
					}
				});
				
			},
			//上传
			cloud(){
				uni.showActionSheet({
				    itemList: ['上传','恢复'],
				    success: (res)=> {
						 if(res.tapIndex === 0)
						 {
							this.upload()
						 }else{
							this.recover()
						 }
				    },
				    fail: function (res) {
				        // console.log(res.errMsg);
				    }
				});
			},
			
			//清空
			clear(){
				uni.showModal({
				    title: 'Tip',
				    content: '确定清空周'+"一二三四五六末"[this.selectItem-1]+'安排？',
				    success: res => {
				        if (res.confirm) {
							let info
							let iconFlag
				            if(this.taskList.length == 0){info = '还没有计划哦'; iconFlag = "none"}
							else{info = '搞定'; iconFlag = "success"; uni.vibrateShort();}
							this.taskList = []
							this.lostFocus()
							uni.showToast({
								icon: iconFlag,
							    title: info,
							    duration: 1000
							});
							
				        } else if (res.cancel) {
				            uni.showToast({
								icon: "none",
				                title: '下次小心点',
				                duration:1000
				            });
				        }
				    }
				});
				this.initRedPoint()
			},
			
			//输入时触发
			onInput(e, id){
				let inputChar = e.detail.value
				if(inputChar == "")
				{
					let len = this.taskList.length;
					for(var i = 0; i < len; ++i)
					{
						if(this.taskList[i].text == "") //删除了
						{
							this.taskList.splice(i, 1); //删除掉该项目
							if(i == len-1)//如果删除的是最后一个
							{
								this.lostFocus("LAST_FLAG")
							}else{
								this.lostFocus(i)
							}
							break;
						}
					}
				}else if(inputChar[inputChar.length - 1] == '\n')
				{
					this.lostFocus()
				}
			},
			
			//聚焦时调整输入状态为true
			onFocus(e, id){
				// console.log("onFocus",id)
				this.taskList[id].focus = true; //焦点打开
				// console.log(this.taskList[id].focus)
				setTimeout(()=> {
					if(this.textareaWrite)
						this.scrollTop = this.scrollTop + 1; //我也不知道为啥，反正得有点变化才会滑动 
				}, 300);
				this.textareaWrite = true;	
			},
			
			//失去焦点时自动保存
			lostFocus(e, id){
				// console.log(id)
				if(id!=undefined){
					this.taskList[id].focus = false; //焦点关闭
					// console.log(this.taskList[id].focus)
				}
				if(id != undefined)
				{
					this.keyboardHeight = 0;
					this.textareaWrite = false;
				}else if(e == "LAST_FLAG"){  //如果id是undefined，证明是由于删除了该待办引起的lostfocus，判断是否是最后一个
					// console.log("LAST_FLAG")
					if(this.taskList.length > 0) //是最后一个的话，判断是否还有剩余，否则关闭键盘
					{
						this.taskList[this.taskList.length - 1].focus = true
					}else{
						this.keyboardHeight = 0;
						this.textareaWrite = false;
					}
				}else{ //如果不是最后一个，则定位到下一个
					// console.log(e)
					if(this.taskList.length > e) //是最后一个的话，判断是否还有剩余，否则关闭键盘
					{
						this.taskList[e].focus = true
					}else{
						this.keyboardHeight = 0;
						this.textareaWrite = false;
					}
				}
				// this.taskList[this.taskList.length-1].focus = false;//如有新增，将最后一条的focus属性设置为false，取消聚焦
				//判断是否修改了
				// if(JSON.stringify(this.taskList) == JSON.stringify(uni.getStorageSync(this.selectItem.toString()))){
				// 	if(this.taskList[id].text.trim() == "")
				// 	{
				// 		this.taskList.splice(id, 1);
				// 	}else{
				// 		return
				// 	}
				// 	}
				this.setStorage()
				// uni.showToast({
				//     title: 'Saved',
				//     duration: 700
				// });
				this.initRedPoint()
				// console.log(this.taskList)
			},
			
			//切换标签时更新看板
			changeSelect(id){
				this.scrollTop = 0;
				if(this.selectItem == id) return;
				this.show = false; //动画隐藏看板
				this.selectItem = id;
				let timeOut = (this.taskList.length>0 || this.modelTaskList.length>0) ? 250 : 0;
				setTimeout(() =>{
					this.selectItemForTransition = this.selectItem; //专门又设置了前者是为了作为uni-transition的key值，不设置key值可能导致不显示，但是key值一变会瞬间消失，所以在动画结束后再改变key值。
					this.getStorage();  //改成了同步函数
					this.show = true;
				}, timeOut);
							
			}
		}
	}
</script>

<style>
	.hide{
		opacity: 0;
		/* transform: scale(0.9); */
	}
	.main_index{
		/* border: 4px solid #0e2ebc; */
		height: 100vh;
	}
	/* @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"); */
	/* 这个css可以在切换看板的时候增加动画 */
/* 	textarea *{
		transition-timing-function: ease-in-out; 
		transition: 0.1s;
	} */
	.input{
		opacity: 0;
		transition: 0.3s;
		transition-timing-function: ease-in-out;
	}
	.add{
		width: 100rpx;
		height:100rpx;
		animation-timing-function: ease-in-out;
		transition: 0.05s;
		position: fixed;
		bottom: 50rpx;
		right: 30rpx;
		background-color: rgb(0,122,255);
		border-radius: 50%;
		box-shadow: 3rpx 0 15rpx #353535;
	}
	.add:active{
		transform: scale(0.9);
	}
	.add image{
		width: 55rpx;
		height:55rpx;
		position: absolute;     
		top: 50%;     
		left: 50%;     
		transform: translate(-27.5rpx,-27.5rpx); 
	}
	.btntop{
/* 		margin-top: -10rpx;
		transition: 0.6s;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0; */
	}
	.checked{
		text-decoration: line-through;
		opacity: 0.6;
		transform: scale(0.9);
	}
	.right .label{
		margin-bottom: 15rpx;
		height: fit-content;
		/* border: 1px solid #ff003b; */
		display: block;
	}
	.right .label .checkbox{
	
		margin-left: 10rpx;
		display: inline-block;
		width: 10%;
		height: 50rpx;
		/* border: 1px solid #4CD964; */
	}
	.right .label checkbox{
		transform: scale(0.8);
		transition-timing-function: ease-in-out;
		transition: 0.6s;
	}
	.right .label .textarea{
		width: 86%;
		line-height: 50rpx;
		margin: 0 auto;
		/* border: 1px solid #d93838; */
		display: inline-block
	}
	textarea{
		transition-timing-function: ease-in-out;
		transition: 0.6s;
		/* border: 1px solid #6bd0d9; */
		letter-spacing: 2.5rpx;
		width: 100%;
		font-size: 31rpx;
		line-height: 50rpx;
	}
	.redPoint{
		display: inline-block;
		border-radius: 50%;
		background-color: #ff0814;
		margin-right: -8rpx;
		width: 8rpx;
		height: 8rpx;
		opacity: 0.8;;
	}
	.title{
		padding: 17rpx;
		text-align: center;
		font-weight: bold;
	}
	page{
		/* height: 100%; */
	}
	.content{
		transition: 0.2s;
		transition-timing-function: ease-in-out;
		/* height: 99%; */
/* 		margin-left: 10rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx; */
		padding-left: 10rpx;
		padding-bottom: 10rpx;
		padding-right: 10rpx;
		display: flex;
		position: absolute;
		top: 140rpx;
		bottom: 0rpx;
		left: 0rpx;
		right: 0rpx;
	}
	.left{
		height: 100%;
		width: 20%;
		/* border: 1px solid #007AFF; */
		color: #353535;
		text-align: center;

	}
	.weeks{
		animation-timing-function: ease-in-out;
		transition: 0.3s;
		height: 700rpx;
		background-color: #ededee;
		border-radius: 10rpx;
	}
	.right{
		position: relative;
		height: 100%;
		top: 0rpx;
		bottom: 40rpx;
		margin-left: 10rpx;
		/* border: 1px solid #4CD964; */
		animation-timing-function: ease-in-out;
		transition: 0.3s;
		width: 80%;
		background-color: #ededee;
		border-radius: 10rpx;
	}
	.boxl{
		height: 100rpx;
		line-height: 100rpx;
		font-size: 35rpx;
		transition: 0.2s;
		transition-timing-function: ease-in-out;
	}
	.active
	{
		font-weight: bold;
		border-radius: 10rpx;
		background-color: white;
		box-shadow: 1rpx 1rpx 10rpx 1rpx #cbcbcb;
		transform: scale(1.01);
	}
	
	.btns{
		transition-timing-function: ease-in-out;
		transition: 0.3s;
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0rpx;
	}
	.bt1{
		border-radius: 10rpx;
		width: 100%;
		borde: none;
		outline: none;
		/* position: absolute;
		left: 0;
		bottom: 1rpx; */
	}
	.btn{
		margin-top: 10rpx;
		border-radius: 10rpx;
		width: 100%;
	}
	hr{
		border:none;
		border-top:1px solid #c9ccd0;
		width: 40%;
		margin: 0 auto;
	}
/* 	#dark{
		background-color: #222222 !important;
		overflow: hidden;
	} */
</style>