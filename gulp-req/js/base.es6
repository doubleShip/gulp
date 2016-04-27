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
var _loadCssJs = function(srcs,isAsync) {
	if(typeof srcs == 'undefined' || srcs.length === 0) {
		return false;
	}

	var head  = document.getElementsByTagName("head")[0],
		dbody = document.body,
		source;

	for(var i=0; i<srcs.length; i++) {
		if(srcs[i].indexOf('.css') > 0) { //判断是否是css
			//创建link
			source  = document.createElement("link");
			source.type = "text/css";
			source.href = srcs[i];
			source.rel  = "stylesheet";
		}
		else {
			//创建script
			source = document.createElement("script");
			source.type = "text/javascript";
			//设置为异步
			source.async = isAsync || false;
			source.src = srcs[i];
			source.charset = "utf-8";
		}
		//防止没有head标签的情况
		if (!head) {
			dbody.insertBefore(source, dbody.firstChild);
		} else {
			head.appendChild(source);
		}
	}
};

var viewBook = function (bookId) {
	console.log("viewBook: bookId is populated: " + bookId);
};

// 路由配置
var routes = {
	'/': _loadCssJs([
		'css/page/test.min.css',
		'js/page/home.min.js'
	]),
	'/test.html': "",
	'/books/view/:bookId': viewBook
};

var router = Router(routes);

router.init();