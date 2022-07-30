<template>
	<view :data-theme="this.$store.state.appTheme" class="main_feedback">
		<uni-navbar 
		title="联系我"
		:backShow="true"
		></uni-navbar>
		<view class="head">
			<h1>联系我</h1>
		</view>
		
		<view class="content">
			<ul>
				<li>
					邮箱：aseaesa@163.com
				</li>
				<li>
					GitHub：AAAAsea
				</li>
			</ul>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				desc: ""
			}
		},
		methods: {
			
		},
		onLoad(){
			
		}
	}
</script>

<style>
	page{
		height: 100%;
		overflow: hidden;
	}
	.main_feedback{
		height: 100vh;
		/* border: 1px solid blue; */
	}
	.head{
		padding-top: 80rpx;
		text-align: center;
	}
	.content{
		padding: 20rpx;
		border-radius: 10rpx;
		/* background-color: #f9f9f9; */
		word-break: break-all;
		color: #353535;
		letter-spacing: 2rpx;
		margin: 100rpx 100rpx;
	}
	li{
		height: 50rpx;
	}
</style>
