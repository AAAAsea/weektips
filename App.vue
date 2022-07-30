<script>
	//import store from '@/store/index.js';//需要引入store
	export default {
	        data(){
	            return {
					name: "app",
	                curVersion:'1.0.0',
	            }
	        },
	        onLaunch: function() {
				//判断系统主题（好像无效）
				// let system_theme = plus.navigator.getUIStyle();
				// this.$store.commit('CHANGE_APP_THEME', system_theme);
				
				//获取设置信息
				if(typeof uni.getStorageSync('settings') != "string")
				{
					// console.log(uni.getStorageSync('settings'))
					this.$store.state.settings = {...this.$store.state.settings, ...uni.getStorageSync('settings')}
				}
				this.$store.commit('CHANGE_MIDTAB_SHOW', this.$store.state.settings.midTabShow);
				
				//每次启动的时候判断是否是今天第一次启动，如果是，则将今天的模板全部置为unchecked
				let last_day = uni.getStorageSync('last_day');
				let today = new Date().getDay().toString()
				if(last_day != today)
				{
					//获取模板存储
					let modelTaskList = uni.getStorageSync("model_" + today)
					if(modelTaskList != "")
					{
						modelTaskList.forEach(e=>{
							e.checked = false;
						})
						uni.setStorageSync("model_"+today, modelTaskList)
					}
					uni.setStorageSync("last_day",today)
				}
				
				//获取上次主题模式和动画模式
				if(this.$store.state.settings.saveTheme)
				{
					this.$store.state.appTheme = uni.getStorageSync('appTheme') 
					if(this.$store.state.appTheme == "")
					{
						this.$store.state.appTheme = "light"
						uni.setStorageSync("appTheme","light")
					}
					this.$store.commit('CHANGE_APP_THEME', this.$store.state.appTheme);
				}
				if(this.$store.state.settings.saveTransition)
				{
					this.$store.state.transitionTypeNumber = uni.getStorageSync('transitionTypeNumber');
				}
				
				//异步读取账户信息
				uni.getStorage({
					key:'loginTime',
					success: (res)=>{
						// console.log(res)
						//判断登录是否过期（10天）
						if(Date.parse(new Date()) - res.data < 864000000)
						{
							uni.getStorage({
								key:'hasLogin',
								success: (res)=>{
									this.$store.state.hasLogin = res.data
								}
							})
							uni.getStorage({
								key:'loginType',
								success: (res)=>{
									this.$store.state.loginType = res.data
								}
							})
							uni.getStorage({
								key:'userInfo',
								success: (res)=>{
									this.$store.state.userInfo = res.data
								}
							})
							
						}else{
							console.log("登录过期")
							uni.setStorageSync('hasLogin',this.$store.state.hasLogin)
							uni.setStorageSync('userInfo',this.$store.state.userInfo)
						}
					}
				})
				//调整全局变量(已经转为vuex)
				// uni.getStorage({
				// 	key: "darkMode",
				// 	success: (res)=>{
				// 		this.globalData.darkMode = res.data
				// 	},
				// 	fail: ()=>{
				// 		this.globalData.darkMode = false
				// 	}
				// })
				//判断上一次更新时间,最多一分钟检查一次更新
				let timestamp = Date.parse(new Date());
				uni.getStorage({
					key:"lastUpdateTime",
					success: (res)=>{
						if(timestamp - res.data > 60000){
							uni.setStorage({
								key:"lastUpdateTime",
								data: timestamp
							})
							// console.log("储存当前时间")
							this.checkUpdate(this.name);
						}else{
							// console.log("刚刚才更新过")
						}
					},
					fail: ()=>{
						uni.setStorage({
							key:"lastUpdateTime",
							data: timestamp
						})
						this.checkUpdate(this.name);
					}
				})
	            
	        },
	        
			onShow: function() {
				
	            // console.log('App Show')
			
	        },
	        onHide: function() {
	            // console.log('App Hide')
	        },
	        methods: {
	            // 版本升级
	            //# ifdef APP-PLUS
	            checkUpdate(name){
					if(!this.$store.state.settings.autoUpdate)
					{
						console.log("已关闭自动检查更新");
						return;
					}
	                // 获取manifest.json 的信息
	                plus.runtime.getProperty( plus.runtime.appid, wgtinfo=>{
	                    this.curVersion = wgtinfo.version;
	                    // console.log( "this.curVersion:" + this.curVersion );
	                } );
	                // 更新版本接口  
	                var server = "https://api.github.com/repos/aaaasea/weektips/releases/latest"; 
	                var that = this;
	                
	                uni.request({
	                    url: server,  //请求更新地址
						header: {
							// "Authorization": "token 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"
						},
	                    success(res) {
							uni.hideLoading()
							// console.log(res)
							let my_res
							try{
									my_res = {
									version: res.data.tag_name,
									downloadUrl: res.data.assets[0].browser_download_url,
									content: res.data.body
								}
							}catch{
								uni.showToast({
									icon: "none",
									title: "发现最新版本但更新失败..."
								})
								return
							}
							if(res.statusCode == 200 && that.curVersion >= my_res.version && name !== "app")
							{
								 uni.showToast({
								 	icon: "none",
									title: "已经是最新版本"
								 })
							}
	                        if (res.statusCode == 200 && that.curVersion < my_res.version) {
	                            uni.showModal({
	                                title: '发现新版本' + my_res.version,
	                                content: my_res.content,
	                                confirmText: "更新",
	                                // showCancel: !res.forceUpdate,
	                                success: function(e) {
	                                    if (e.confirm) {
	                                        if (plus.os.name.toLowerCase() == 'ios') {
	                                            // 跳转到下载页面
	                                            plus.runtime.openURL(my_res.downloadUrl)
	                                        } else {
	                                            that.createDownload(my_res.downloadUrl);
	                                        }
	                                    } else {
	                                        //取消
	                                    }
	                                }
	                            });
	                        } else {
	                            // uni.showModal({
	                            //     title: '提示',
	                            //     content: '已是最新版本',
	                            //     showCancel: false
	                            // });
	                        }
	                    },
	                })
	            },
	            createDownload(url){
	                var dtask = plus.downloader.createDownload(url, {},
	                    function(d, status) {
	                        uni.showToast({
	                            title: '下载完成',
	                            mask: false,
	                            duration: 1000
	                        });
	                        //console.log(dtask);
	                        // 下载完成
	                        console.log('status: '+status);
	                        if (status == 200) {
	                            console.log('下载成功：'+d.filename);
	                            console.log('plus.io.convertLocalFileSystemURL(d.filename): '+plus.io.convertLocalFileSystemURL(d.filename))
	                            plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, function(success) {
	                                uni.showToast({
	                                    title: '下载成功',
	                                    mask: false,
	                                    duration: 1500
	                                });
	                            }, function(error) {
	                                uni.showToast({
	                                    title: '安装失败-01',
	                                    mask: false,
	                                    duration: 1500
	                                });
	                            })
	                        } else {
	                            uni.showToast({
	                                title: '更新失败-02',
	                                mask: false,
	                                duration: 1500
	                            });
	                        }
	                });
	                try {
	                    dtask.start(); // 开启下载的任务
	                    var prg = 0;
	                    var showLoading = plus.nativeUI.showWaiting("正在下载");  //创建一个showWaiting对象 
	                    dtask.addEventListener('statechanged', function(task,status) {
	                        // 给下载任务设置一个监听 并根据状态  做操作
	                        switch (task.state) {
	                            case 1:
	                                showLoading.setTitle("正在下载");
	                                break;
	                            case 2:
	                                showLoading.setTitle("已连接到服务器");
	                                break;
	                            case 3:
	                                prg = parseInt((parseFloat(task.downloadedSize) / parseFloat(task.totalSize)) * 100 );
	                                showLoading.setTitle("  正在下载" + prg + "%  ");
	                                break;
	                            case 4:
	                                plus.nativeUI.closeWaiting();
	                                //下载完成
	                                break;
	                        }
	                    });
	                  } catch (err) {
	                    plus.nativeUI.closeWaiting();
	                    uni.showToast({
	                        title: '更新失败-03',
	                        mask: false,
	                        duration: 1500
	                    });
	                }
	            },
	            
	        }
	    }
</script>

<style lang="scss">
	/*每个页面公共css */
	/* #ifndef APP-PLUS-NVUE */
		@import './static/scss/theme.scss';
		@import './static/iconfont/iconfont.css';
		
		page{
			background-color: #ffffff;
		}
	/* #endif */

	
</style>
