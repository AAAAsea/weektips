<template>
	<view :data-theme="this.$store.state.appTheme" class = "main_mine">
		<uni-navbar
		title="我的"
		></uni-navbar>
		<view class="avatar">
			<image :src="avatarUrl" mode="aspectFit" @click="changeAvatar"></image>
		</view>
		<view class="version">
			{{name}}<br/>
			<!-- Version {{version}} -->
		</view>
		<view class="tab">
			<view class="content">
				<hr/>
				<view class="item" hover-class="button-hover" hover-start-time="0" hover-stay-time="15" @click="toLogin">
					{{!$store.state.hasLogin ? "登录" : "登出"}}
					<span><image :src="arrowUrl"></image></span>
				</view>
				<hr/>
				<view class="item" hover-class="button-hover" hover-start-time="0" hover-stay-time="15" @click="toAbout">
					关于
					<span><image :src="arrowUrl" ></image></span>
				</view>
				<hr/>
			</view>
		</view>
		
	</view>
</template>

<script>
	// import store from '@/store/index.js'
	export default {
		data() {
			return {
				// name: "about",
				version: '1.0.0',
				arrowUrl: '/static/pics/arrow.png'
			}
		},	
		methods: {
			changeAvatar(){
				if(this.$store.state.loginType == 'qq' || !this.$store.state.hasLogin)
				{
					uni.showToast({
						icon: "none",
						title:"非qq登录后可换头像",
						duration: 1000
					})
					return
				}
				uni.chooseImage({
				    count: 1,
					crop: {
						width: 200,
						height: 200	
					},
				    success: (res)=>{
						//保存原来的图片路径待会删了
						let old_path = this.$store.state.userInfo.avatarUrl
						// console.log(old_path)
						uni.saveFile({
							tempFilePath: res.tempFilePaths[0],
							success:(res)=> {
							  this.$store.state.userInfo.avatarUrl = res.savedFilePath;
							  // console.log("头像本地路径：",state.userInfo.avatarUrl)
							  uni.setStorageSync('userInfo',this.$store.state.userInfo);
							  //本地存储当前账户的头像（以便可以切换账户而不丢失头像）
							  uni.setStorageSync(this.$store.state.userInfo.account + '_avatar', res.savedFilePath)
							  uni.removeSavedFile({
							  	filePath: old_path,
							  	success: function (res) {
							  	  // console.log("删除成功");
							  	}
							  });
							},
						});
											
				    }
				});
			},
			logout_qq(){
				uni.showModal({
				    title: '提示',
				    content: '确定登出账号？',
				    success: res=> {
						if(res.confirm){
							this.$store.commit('logout')
						}else if (res.cancel) {
				            uni.showToast({
								icon:"none",
				            	title:"下次注意"
				            })
				        }
				    }
				});
				
			},
			toAbout(){
				uni.navigateTo({
					url: "./about/about",
					animationType: 'slide-in-right',
					animationDuration: 300,
				})
			},
			toLogin(){
				if(this.$store.state.hasLogin)
				{
					this.logout_qq()
				}else{
					uni.navigateTo({
						url: "./login/login",
						animationType: 'slide-in-right',
						animationDuration: 200,
					})
				}
			},
		},
		computed:{
			avatarUrl(){
				return this.$store.state.userInfo.avatarUrl
			},
			name(){
				return this.$store.state.userInfo.nickName
			},
			
			color(){
				return this.$store.state.appTheme != 'dark' ? '#000' : '#fff'
			}
			
		},
		onLoad(){
			plus.runtime.getProperty( plus.runtime.appid, wgtinfo=>{
			    this.version = wgtinfo.version;
			} )
		},
		onShow(){
			this.$store.commit('SET_NAV_TAB')
			// console.log(this.$store.state) 
			this.arrowUrl = this.$store.state.appTheme=='dark'?'/static/pics/arrow2.png':'/static/pics/arrow.png'
			// console.log(this.arrowUrl) 
		}

	}
</script>

<style>
	.main_mine{
		height: 100vh;
	}
	*{
		transition: 0.3s;
		transition-timing-function: ease-in-out;
	}
	/* .dark
	{
			color: #e8e9eb;
			background-color: #000000;
	} */
	.container{
		height: 100vh;
	}
	.avatar{
		transition-timing-function: ease-in-out; 
		text-align: center;
		
	}
	.avatar image:active{
		transition: 0.8s;
		transform: rotateY(360deg)
	}
	.avatar image{
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		margin-top: 100rpx;
	}
	.tab{
		color: #555555;
		margin-top: 100rpx;
		/* border: 1px solid #007AFF; */
		/* text-align: center; */
		/* width: 70%; */
	}
	.content{
		margin: 0 auto;
		/* border: 1rpx solid #4CD964; */
		width: 80%;
		/* text-align: left; */
	}
	.item{
		font-size: 32rpx;
		padding: 0 10rpx;
		height: 100rpx;
		line-height: 100rpx;
	}
	hr{
		border:none;
		border-top:1px solid #eaeaea;
		/* width: 0%; */
		/* margin: 0 auto; */
	}
	.version{
		margin-top: 15rpx;
		text-align: center;
		line-height: 50rpx;
	}
	.item image{
		width: 22rpx;
		height: 23rpx;
	}
	.item span{
		/* color: #939393; */
		float: right;
	}
</style>
