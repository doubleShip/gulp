/**
 * Created by yvan on 16/4/28.
 */

let loadCssJs = require('./loadCssJs.es6');

// 路由配置
let routes = {
	'/': loadCssJs([
		'js/page/home.js'
	]),
	'/test.html': ""
};

module.exports = routes;