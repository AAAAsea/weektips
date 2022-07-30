<template>
	<view :data-theme="this.$store.state.appTheme" class="main_login">
		<page-meta>
				<navigation-bar
					:background-color="$store.getters.backgroundColor"
					:front-color="$store.getters.frontColor"
				/>
		</page-meta>
		<uni-navbar
		title="登录"
		:backShow="true"
		></uni-navbar>
		<view class="form login">
			<form>
				<input type="text" v-model="account" value="" />
				<input type="password" v-model="passwd" value="" />
				<button @click="login">登录</button>
				<view class="qq">
					<image src="../../../static/pics/icon_QQ.png" class="qq_img" @click="login_qq"></image>
					<br/>
					<text>使用其它方式登录</text>
				</view>
			</form>
			<view class="bottom">
				<span>提示：没有账号也可以直接登录，系统会自动创建账号，请牢记你的账号密码！!</span>
			</view>
		</view>
	</view>
</template>

<script>
	let upload_record = {}
	export default {
		data(){
			return{
				account: '',
				passwd: '',
			}
		},
		methods: {
			
		},
		onLoad(){
			this.account = uni.getStorageSync("userInfo").account
			if(this.$store.state.settings.saveLogin)
			{
				this.passwd = uni.getStorageSync("userInfo").passwd
			}
		},
		methods:{
			login(){
				this.$store.commit('login', {account: this.account, passwd: this.passwd})	
			},
			login_qq(){
				this.$store.commit('login_qq')				
			}
		}
	}
</script>

<style>
	.qq{
		position: fixed;
		bottom: 300rpx;
		left: 0;
		right: 0;
		text-align: center;
		color: #909090;
	}
	.main_login{
		height: 100vh;
		width: 100vw;
	}
	.qq_img{
		width: 70rpx;
		height: 70rpx;
	}
	.form{
		/* border: 1px solid red; */
		margin: 0 auto;
		margin-top: 100rpx;
		padding: 200rpx 0;
	}
	input{
		opacity: 0.5;
		width: 40%;
		transition: 0.3s;
		/* color: #909090; */
		padding-left: 20rpx;
		height: 60rpx;
		line-height: 60rpx;
		border-bottom: 1px solid;
		display: flex;
		flex-wrap: nowrap;
		margin: 30rpx auto;
	}
	input:first-child::before{
		transition: 0.3s;
		content: "账号";
		width: 100rpx;
		line-height: 60rpx;
	}
	input:nth-child(2)::before{
		transition: 0.3s;
		content: "密码";
		width: 100rpx;;
		line-height: 60rpx;
	}
	input:hover{
		opacity: 1;
		width: 60%;
		/* background-color: #e8f0fe; */
		border-bottom: 1px solid #31a7cb;
	}
	input:hover::before{
		color: #007AFF;
	}
	button{
		width: 60%;
		color: white !important;
		line-height: 80rpx;
		background-color: #59b1fe;
		margin-top: 100rpx;
		height: 80rpx;
		/* border-radius: 40rpx; */
		/* border: 2px solid #909090; */
	}
	.bottom{
		padding: 30rpx;
		left: 10rpx;
		text-align: center;
		position: absolute;
		bottom: 100rpx;
		color: #909090;
	}
</style>
