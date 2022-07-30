<template>
	<view :data-theme="this.$store.state.appTheme" class="main_questions">
		<uni-navbar
		title="问题"
		:backShow="true"
		></uni-navbar>
		<view class="head">
			<h1>常见问题</h1>
		</view>
		
		<view class="content">
			<ul v-for="(item,index) in qas">
				<li style="font-weight: bold; color: #3F538E;">{{item.question}}</li>
				<view class="answer">
					{{item.answer}}
				</view>
			</ul>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				qas: []
			}
		},
		methods: {
			
		},
		onReady(){
			uni.showLoading({
				title:"Loading..."
			})
			const collection = uniCloud.database().collection('questions');
			collection.get().then(res=>{
				this.qas = res.result.data
				uni.hideLoading()
			})
		}
	}
</script>

<style>
	.main_questions{
		height: 100vh;
	}
	.head{
		padding-top: 80rpx;
		text-align: center;
	}
	.content{
		padding-top: 70rpx;
		padding-bottom: 60rpx;
		padding-right: 40rpx;
		border-radius: 10rpx;
	/* 	background-color: #f9f9f9; */
		letter-spacing: 2rpx;
		margin: 100rpx 80rpx;
	}
	.answer{
		font-size: 30rpx;
		color: #555555;
		line-height: 50rpx;
	}
	li{
		line-height: 50rpx;
	}
</style>
