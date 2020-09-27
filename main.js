import Vue from 'vue'
import App from './App'

//挂载请求函数
import request from './static/js/request';
Vue.prototype.$request = request


// 时间
import moment from './static/js/moment';
moment.locale('zh-cn');
Vue.filter("$timefilter", v => {
	let time = new Date().getTime()
	if ((time - v) > 1000 * 60 * 60 * 24 * 365) {
		return moment(v).format("YYYY-MM-DD HH:mm:ss")     //具体日期
	} else if ((time - v) > 1000 * 60 * 60 * 24 * 30) {
		return moment(v).startOf('month').fromNow();      // 月前
	} else if ((time - v) > 1000 * 60 * 60 * 24) {
		return moment(v).startOf('date').fromNow();			// 天前
	} else if ((time - v) > 1000 * 60 * 60) {
		return moment(v).startOf('hour').fromNow();        // 13 小时前
	} else if (v - time < 1000 * 60 * 60) {
		return moment(v).startOf('minute').fromNow();       // 4 分钟前
	} else if (v - time < 1000 * 60) {
		return moment(v).startOf('second').fromNow();		//n 秒前
	}
})
Vue.filter("$timeDate", v => {
	return moment(v).format("YYYY-MM-DD HH:mm:ss")     //具体日期
})



import showToast from './static/js/showToast';
Vue.prototype.$showToast = showToast


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
