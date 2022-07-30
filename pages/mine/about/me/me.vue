<template>
	<view :data-theme="this.$store.state.appTheme" class="main_me">
		<uni-navbar
		title="作者"
		:backShow="true"
		></uni-navbar>
		<view class="avatar" >
			<image src="/static/pics/logo.jpg" mode="aspectFit"></image>
		</view>
		<view class="author">
			<br/>
			<a href="https://github.com/AAAAsea">Asea</a><br/>
			<a href="https://github.com/koali-www">Koali</a>
		</view>
		<button hover-start-time="0" type="default" hover-class="pressed" @click="award" style="color: #eee;
		background-color: #242424;">
			赞赏
		</button>
		<view class="img" :style="{'opacity':opacity}">
			<image src="/static/pics/wechat.png" mode="aspectFit"></image>
			<view style="font-size: 33rpx; color: #555555;">
				赠人玫瑰，手留余香
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				opacity: 0
			}
		},
		methods: {
			award(){
				this.opacity = this.opacity == 0 ? 1: 0;
			}
		}
	}
</script>

<style>
	.main_me{
		height: 100vh;
	}
	.avatar{
		text-align: center;
	}
	.avatar image{
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		margin-top: 100rpx;
	}
	.author{
		text-align: center;
		margin-top: 50rpx;
		font-size: 30rpx;
		color: #808080;
	}
	button{
		margin-top: 100rpx;
		width:30%;
	}
	.pressed{
		background-color: #555555;
		/* box-shadow: 3rpx, 3rpx, 3rpx, #353535; */
	}
	image{
		width: 40%;
	}
	.img{
		transition-timing-function: ease-in-out;
		transition: 1s;
		opacity: 50%;
		text-align: center;
		margin: 0 auto;
	}
	 a:link { text-decoration: none;color: #808080}
　　 a:active { text-decoration:blink}
　　 a:hover { text-decoration:underline;color: red}
　　 a:visited { text-decoration: none;color: #808080}
</style>
