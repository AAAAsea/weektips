<template>
	<view  :data-theme="this.$store.state.appTheme" class="main_clock">
		<view class="content" @click="iconShow = !iconShow">
			<span class="iconfont icon-back back" :class="{'iconHide':iconShow}" @click.stop="backToLast"></span>
			<span :class="{'iconfont':true, 'icon-sun':$store.state.appTheme == 'light', 'icon-moon':$store.state.appTheme == 'dark', 'icon-theme': true, 'iconHide':iconShow}" @click.stop="changeTheme"></span>
			<view class="punch-time move">{{ clock | FormatTime }}</view>
		</view>
	</view>
</template>

<script>
	import {getDate} from "../../../static/js/currentTime.js";
	
	export default {
		data() {
			return {
				clock: Date.parse(new Date()),
				iconShow: false
			}
		},
		onLoad() {

		},
		mounted() {
			// console.log(plus.navigator.getUIStyle())
			setTimeout(function() {plus.navigator.hideSystemNavigation();}, 300);
			plus.navigator.setFullscreen(true);//隐藏状态栏
			plus.screen.lockOrientation('landscape-primary'); //锁
		    let _this = this;
		    setInterval(function () {
		      _this.clock = Date.parse(new Date());
		    }, 1000);
		},
		onBackPress(){
			// console.log("rotate")
			setTimeout(function() {plus.navigator.showSystemNavigation();}, 300);
			setTimeout(function() {plus.navigator.setFullscreen(false);}, 300);
			plus.screen.lockOrientation('portrait-primary'); //锁
		},
		filters: {
		    FormatTime: function (val) {
		      return getDate(val, "hour");
		    },
		},
		methods: {
			backToLast(e){
				uni.navigateBack()
			},
			changeTheme(e){
				this.$store.state.appTheme = this.$store.state.appTheme == 'light' ? 'dark' : 'light';
				this.$store.commit('CHANGE_APP_THEME', this.$store.state.appTheme);
			}
		}
	}
</script>

<style>
	.main_clock{
		height: 100vh;
	}
	*{
		box-sizing: border-box;
	}
	.iconHide{
		opacity: 0;
		
	}
	@keyframes move{
		0%{
			transform: translate(0, 0);
		}
		20%{
			transform: translate(-5%, 5%);
		}
		40%{
			transform: translate(-5%, -5%);
		}
		60%{
			transform: translate(5%, -5%);
		}
		80%{
			transform: translate(5%, 5%);
		}
		100%{
			transform: translate(0, 0);
		}
	}
	.icon-theme{
		transition: 0.3s;
		position: fixed;
		top: 50rpx;
		right: 50rpx;
		font-size: 60rpx;
		z-index: 9999;
	}
	.back{
		transition: 0.3s;
		position: fixed;
		top: 50rpx;
		left: 50rpx;
		font-size: 60rpx;
		font-weight: bold;
		z-index: 9999;
	}
	.content{
		/* border: 2px solid #3613ff; */
		/* background-color: #ffffff; */
		height: 100vh;
		text-align: center;
		overflow: hidden;
		}
	.punch-time{
		letter-spacing: 20rpx;
		height: 100%;
		/* border: 7px solid #0077AA; */
		line-height: 100vh;
		margin: 0 auto;
		color: #000000;
		font-size: 100px;
		font-weight: bold;
		animation-name: move;
		animation-duration: 300s;
		animation-iteration-count: infinite;
		transition-timing-function: ease-in-out;
	}
</style>
