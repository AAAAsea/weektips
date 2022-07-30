<template>
	<page-meta>
		<navigation-bar
			:background-color="$store.getters.backgroundColor"
			:front-color="$store.getters.frontColor"
			:color-animation-duration="20000"
		/>
	</page-meta>
	<view :data-theme="this.$store.state.appTheme" class="main_about">
		<uni-navbar
		title="关于"
		:backShow="true"
		></uni-navbar>
		<view class="avatar" >
			<image src="/static/pics/logo_216.png" mode="aspectFit"  lazy-load=true></image>
		</view>
		<view class="version">
			WeekTips<br/>
			Version {{version}}
		</view>
		<view class="tab">
			<view class="content">
				<hr/>
				<view class="item" hover-class="button-hover" hover-start-time="0" hover-stay-time="15" @click="aboutHandle">
					作者
					<span><image :src="arrowUrl"></image></span>
				</view>
				<hr/>
				<view class="item" hover-class="button-hover" hover-start-time="0" hover-stay-time="15" @click="toSettings">
					设置
					<span><image :src="arrowUrl"></image></span>
				</view>
				<hr/>
				<view class="item" hover-class="button-hover" hover-start-time="0" hover-stay-time="15" @click="feedBack">
					反馈
					<span><image :src="arrowUrl"></image></span>
				</view>
				<hr/>
				<view class="item" hover-class="button-hover" hover-start-time="0" hover-stay-time="15" @click="checkUpdate">
					检查更新
					<span><image :src="arrowUrl"></image></span>
				</view>
				<hr/>
				<view class="item" hover-class="button-hover" hover-start-time="0" hover-stay-time="15" @click="toDesc">
					版本介绍
					<span><image :src="arrowUrl"></image></span>
				</view>
				<hr/>
				<view class="item" hover-class="button-hover" hover-start-time="0" hover-stay-time="15" @click="toQuestion">
					常见问题
					<span><image :src="arrowUrl"></image></span>
				</view>
				<hr/>
			</view>
		</view>
		
	</view>

</template>

<script>
	// import navbar from '@/components/navbar.vue'
	// import store from '@/store/index.js';//需要引入store
	export default {
		data() {
			return {
				name: "about",
				version: '1.0.0',
				arrowUrl: '/static/pics/arrow.png'
			}
		},
		computed:{
			title(){
				  let pages = getCurrentPages();  
				  let page = pages[pages.length - 1];  
				  let webView = page.$getAppWebview();  
				  return webView.getStyle().titleNView
			}
		},
		methods: {
			toQuestion(){
				uni.navigateTo({
					url: "./questions/questions",
					animationType: 'slide-in-right',
					animationDuration: 200,
				})
			},
			feedBack(){
				uni.navigateTo({
					url: "./feedback/feedback",
					animationType: 'slide-in-right',
					animationDuration: 200,
				})
			},
			toDesc(){
				uni.navigateTo({
					url: "./description/description",
					animationType: 'slide-in-right',
					animationDuration: 200,
				})
			},
			checkUpdate(){
				uni.showLoading({
					title:"查询中，请稍后...",
					mask: true
				})
				getApp().checkUpdate(this.name)
				// uni.hideLoading()
			},
			aboutHandle(){
				uni.navigateTo({
					url: "./me/me",
					animationType: 'slide-in-right',
					animationDuration: 200,
				})
			},
			toSettings(){
				uni.navigateTo({
					url: "./settings/settings",
					animationType: 'slide-in-right',
					animationDuration: 200,
				})
			}
		},
		onLoad(){
			plus.runtime.getProperty( plus.runtime.appid, wgtinfo=>{
			    this.version = wgtinfo.version;
			} );
			// uni.$on('changeDarkMode',(res)=>{
			// 	this.darkMode = res.darkMode
			// })
		},
		onShow(){
			// this.$store.commit('SET_NAV_TAB')
			this.arrowUrl = this.$store.state.appTheme=='dark'?'/static/pics/arrow2.png':'/static/pics/arrow.png'
		}

	}
</script>

<style>
	.main_about{
		height: 100vh;
	}
	*{
		transition-timing-function: ease-in-out;
		transition: 0.3s;
	}
	.dark{
		color: #e8e9eb;
		background-color: #000000;
	}
	.container{
		height: 100vh;
	}
	.avatar{
		text-align: center;
	}
	.avatar image{
		width: 150rpx;
		height: 150rpx;
		border-radius: 5%;
		margin-top: 100rpx;
		will-change: transform;
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
