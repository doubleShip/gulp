/**
 * Created by yvan on 16/4/27.
 */
/**
 * 动态加载css,js文件
 * @param srcs
 * @param isAsync
 * @returns {boolean}
 * @private
 */

require(['router','loadCssJs'], function () {

	let viewBook = function (bookId) {
		console.log("viewBook: bookId is populated: " + bookId);
	};

	// 路由配置
	let routes = {
		'/': loadCssJs([
			'css/page/test.min.css',
			'js/page/home.min.js'
		]),
		'/test.html': "",
		'/books/view/:bookId': viewBook
	};

	let router = Router(routes);

	router.init();
});