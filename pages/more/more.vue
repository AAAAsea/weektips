<template>
	<view :data-theme="this.$store.state.appTheme" class="main_more">
		<uni-navbar
				title="更多"
				></uni-navbar>
		<view class="container">
			<view class="bubble" @click="template">
				<span class="iconfont icon-bianjimoban"></span>
				<text>模板</text>
			</view>
			<view class="bubble" @click="to_clock">
				<span class="iconfont icon-clock"></span>
			</view>
			<view class="bubble" @click="to_note">
				<span class="iconfont icon-note"></span>
			</view>
			<view class="bubble" @click="to_count">
				<span class="iconfont icon-countdown"></span>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			color(){
				return this.$store.state.appTheme != 'dark' ? '#000' : '#fff'
			}
		},
		methods: {
			template(){
				uni.navigateTo({
					url: "./template/template",
					animationType: 'zoom-fade-out',
					animationDuration: 300,
				})
			},
			to_clock(){
				uni.navigateTo({
					url: "./clock/clock",
					animationType: 'fade-in',
					animationDuration: 500,
				})
			},
			to_note(){
				uni.navigateTo({
					url: "./note/note",
					animationType: 'zoom-fade-out',
					animationDuration: 300,
				})
			},
			to_count(){
				uni.navigateTo({
					url: "./countdown/countdown",
					animationType: 'zoom-fade-out',
					animationDuration: 300,
				})
			},
			// to_test(){
			// 	// console.log("hhh")
			// 	uni.navigateTo({
			// 		url: "./test2/test2",
			// 		animationType: 'fade-in',
			// 		animationDuration: 300,
			// 	})
			// },
			
		},
		onShow(){
			this.$store.commit('SET_NAV_TAB')
		}
	}
</script>

<style>
	.main_more{
		/* border: 4px solid #0e2ebc; */
		height: 100vh;
	}
	.container{
		margin: auto;
		width: 90%;
		flex-wrap: wrap;
		justify-content: space-around;
		align-content: center;
		display: flex;
	}
	.bubble{
		position: relative;
		transition: 0.1s;
		/* border: 1px solid #007AFF; */
		/* background-color: rgb(245,245,245); */
		width: 280rpx;
		height: 280rpx;
		/* border: 1px solid #007AFF; */
		border-radius: 20rpx;
		margin-bottom: 40rpx;
		line-height: 300rpx;
		font-size: 50rpx;
		text-align: center;
		box-shadow: 0 4rpx 8rpx 0 rgba(0, 0, 0, 0.1), 0 6rpx 20rpx 0 rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
	}

	.bubble:active{
		/* box-shadow: 2px 2px 10px #bdbdbd; */
		box-shadow: 0 8rpx 16rpx 0 rgba(0, 0, 0, 0.2), 0 12rpx 40rpx 0 rgba(0, 0, 0, 0.2);
	}
</style>
