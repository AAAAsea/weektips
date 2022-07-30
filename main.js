import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import store from './store'
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
Vue.mixin({
	methods: {
		ChangeAppTheme(color = 'dark') {
			// console.log('ChangeApptheme')
			color = this.$store.state.appTheme == 'dark'?'light':'dark'
			this.$store.commit('CHANGE_APP_THEME', color);
		},
	}

})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif