<template>
	<view :data-theme="this.$store.state.appTheme" class="main_desc">
		<uni-navbar
		title="介绍"
		:backShow="true"
		></uni-navbar>
		<view class="head">
			<h1>版本介绍</h1>
			<view class="attention">注:该内容为当前版本的更新描述</view>
		</view>
		
		<view class="content">
			<h4 v-html>{{version}}版本描述</h4>
			<br/>
			<view v-html="desc">
				
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				desc: "",
				version: "1.0.0"
			}
		},
		methods: {
			
		},
		onLoad(){
			plus.runtime.getProperty( plus.runtime.appid, wgtinfo=>{
			    this.desc = wgtinfo.description.replace(/\\n/g,'<br/>');
				this.version = wgtinfo.version
			} );
		}
	}
</script>

<style>
	page{
		height: 100%;
	}
	.main_desc{
		height: 100vh;
		/* border: 1px solid blue; */
	}
	.head{
		padding-top: 80rpx;
		text-align: center;
	}
	.content{
		padding: 30rpx;
		border-radius: 10rpx;
		/* background-color: #f9f9f9; */
		word-break: break-all;
		color: #353535;
		letter-spacing: 2rpx;
		margin: 100rpx 100rpx;
	}
	.attention{
		text-align: center;
		color: #787878;
	}
	h4{
		text-align: center;
	}
</style>
