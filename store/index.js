// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state:{//存放状态
		transitionTypeNumber:2,
		hasLogin:false,
		loginType: "default",
		userInfo:{
		   nickName: "未登录",
		   avatarUrl: "/static/pics/unlogin2.png",
		   userId: "",
		   account: "",
		   passwd: ""
		},
		loginTime:0,
		appTheme:'light',
		NoteData:[],
		settings:{
			'saveLogin':true,
			'saveTheme':true,
			'saveTransition':true,
			'autoUpdate':true,
			'midTabShow':true
		}
	},
	getters: {
	        backgroundColor: state => {
	            return state.appTheme == 'dark' ? '#000000' : '#ffffff'
	        },
			frontColor: state => {
			    return state.appTheme != 'dark' ? '#000000' : '#ffffff'
			},
	},
	mutations:{
		login(state, user){
			// console.log(state)
			uni.showLoading({
				title:"登录中",
				mask: true
			})
			uniCloud.callFunction({
				name: "login",
				data: {
					account: user.account,
					passwd: user.passwd,
				}
			}).then(res=>{
					uni.hideLoading()
					
					if(res.result.status){
						state.hasLogin = true;
						state.loginType = "default";
						state.userInfo.account = user.account,
						state.userInfo.passwd = user.passwd,
						state.userInfo.nickName = user.account;
						//如果本来存在头像则使用该头像
						if(uni.getStorageSync(user.account + "_avatar"))
						{
							//判断是否存在该文件
							uni.getSavedFileInfo({
							  filePath: uni.getStorageSync(user.account + "_avatar"),
							  success: (res)=> {
							    state.userInfo.avatarUrl = uni.getStorageSync(user.account + "_avatar")
							  },
							  fail() {
							  	state.userInfo.avatarUrl =  "/static/pics/login.png";
							  }
							});
						}
						else
						{
							state.userInfo.avatarUrl =  "/static/pics/login.png";
						}
						
						state.loginTime = Date.parse(new Date()); 
						uni.setStorageSync('hasLogin',state.hasLogin)
						uni.setStorageSync('loginType',state.loginType)
						uni.setStorageSync('userInfo',state.userInfo)
						// uni.setStorageSync('account',state.userInfo.account)
						uni.setStorageSync('loginTime',state.loginTime) //存储当前时间戳
						uni.navigateBack()
					}else{
						uni.showToast({
							icon: "none",
							title: res.result.msg,
							duration:2000,
						})
					}
			})
		},
		login_qq(state){
			uni.login({
			provider: 'qq',
			success: function (loginRes) {
			  // 获取用户信息
			  uni.getUserInfo({
			    provider: 'qq',
			    success: function (infoRes) {
			      // console.log(infoRes); 
				  state.hasLogin = true;
				  state.loginType = "qq";
				  state.userInfo.nickName = infoRes.userInfo.nickname;
				  state.userInfo.avatarUrl = infoRes.userInfo.figureurl_qq;
				  //将qq头像保存到本地，防止每次都要加载
				  uni.downloadFile({
				      url: state.userInfo.avatarUrl, 
					  timeout: 2000,
				      success: (res) => {
				          if (res.statusCode === 200) {
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: function (res) {
									  state.userInfo.avatarUrl = res.savedFilePath;
									  console.log("头像本地路径：",state.userInfo.avatarUrl)
									  uni.setStorageSync('userInfo',state.userInfo)
									},
								});
				          }
				      },
				  });
				  
				  state.userInfo.userId = infoRes.userInfo.openId;
				  
				  state.loginTime = Date.parse(new Date()); 
				  uni.setStorageSync('hasLogin',state.hasLogin)
				  uni.setStorageSync('loginType',state.loginType)
				  uni.setStorageSync('userInfo',state.userInfo)
				  uni.setStorageSync('loginTime',state.loginTime) //存储当前时间戳
				  
				  uni.navigateBack()
			    }
			  });
			}
			});
		},
		logout(state){
			state.hasLogin = false;
			state.userInfo.nickName = "未登录";
			state.userInfo.avatarUrl = state.appTheme=='dark'?"/static/pics/unlogin2.png":"/static/pics/unlogin.png";
			// state.userInfo.avatarUrl = "/static/pics/unlogin.png";
			state.userInfo.userId = "";
			//是否清除密码
			if(!state.settings.saveLogin)
			{
				state.userInfo.passwd = "";
			}
			state.loginTime = Date.parse(new Date()); 
			uni.setStorageSync('hasLogin',state.hasLogin)
			uni.setStorageSync('userInfo',state.userInfo)
		},
		CHANGE_APP_THEME(state,theme='light'){
			// console.log(theme)
			//设置透明
			// let wm = plus.android.importClass("android.view.WindowManager");
			// let tran = wm.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION; // 134217728
			// var ac = plus.android.runtimeMainActivity(); 
			// var win = plus.android.invoke(ac, "getWindow"); 
			// var dv = plus.android.invoke(win, "getDecorView") 
			// plus.android.invoke(dv, "setSystemUiVisibility", 0x00000400)
			// plus.android.invoke(win, "addFlags", 0x80000000) 
			
			//设置主题
			// var color = plus.android.newObject("android.graphics.Color")
			var ac = plus.android.runtimeMainActivity(); 
			var win = plus.android.invoke(ac, "getWindow");  
			let colorInt = -1;
			if(theme == 'dark') colorInt = -16777216
			plus.android.invoke(win, "setNavigationBarColor", colorInt)
			// var c2int = plus.android.invoke(color, "parseColor", "#00000000"); 
			// if(theme == 'light'){
			// 	setTimeout(function() {plus.android.invoke(win, "setNavigationBarColor", -1)}, 20);
			// 	// c2int = plus.android.invoke(color, "parseColor", "#ffffff"); //-1
			// 	// console.log(c2int)
			// 	} 	
			// else{
			// 	setTimeout(function() {plus.android.invoke(win, "setNavigationBarColor", -16777216)}, 20);
			// 	// c2int = plus.android.invoke(color, "parseColor", "#000000"); //-16777216
			// 	// console.log(c2int)
			// 	}
			
			// console.log("c2int===" + JSON.stringify(c2int))  			
			// // console.log("win===" + JSON.stringify(win))  
			
			// // // console.log("切换模式为",theme)
			
			
			state.appTheme = theme
			if(!state.hasLogin)
				state.userInfo.avatarUrl = theme=='dark'?"/static/pics/unlogin2.png":"/static/pics/unlogin.png";
			uni.setStorageSync('appTheme',theme)
			// plus.navigator.setStatusBarStyle('dark');
		},
		SET_NAV_TAB(state){
			// console.log(state.appTheme )
			// uni.showNavigationBarLoading()
			if(state.appTheme == 'dark')
			{
				uni.setTabBarStyle({
				  backgroundColor: '#000000',
				  color:'#ffffff'
				})
				uni.setNavigationBarColor({
					backgroundColor:'#000000',
					frontColor:'#ffffff',
				})
				setTimeout(function() {
					uni.setTabBarStyle({
					  backgroundColor: '#000000',
					  color:'#ffffff',
					  success() {
					  	// console.log("设置成功")
					  }
					})
				}, 300);
			}else{
				uni.setTabBarStyle({
				  backgroundColor: '#ffffff',
				  color:'#000000'
				})
				uni.setNavigationBarColor({
					backgroundColor:'#ffffff',	
					frontColor:'#000000',
				})
				setTimeout(function() {
					uni.setTabBarStyle({
					  backgroundColor: '#ffffff',
					  color:'#000000',
					  success() {
					  	// console.log("设置成功")
					  }
					  
					})
				}, 300);
			}
			
			
		},
		CHANGE_TRANSITION_TYPE(state,typeNum){
			state.transitionTypeNumber = typeNum;
			uni.setStorageSync('transitionTypeNumber',typeNum);
		},
		CHANGE_MIDTAB_SHOW(state){
			uni.setTabBarItem({
			  index: 1,
			  visible: state.settings.midTabShow
			})
		}
	}
	
})
export default store