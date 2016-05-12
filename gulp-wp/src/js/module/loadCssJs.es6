/**
 * Created by yvan on 16/4/27.
 */

let loadCssJs = function(srcs,isAsync) {
	if(typeof srcs == 'undefined' || srcs.length === 0) {
		return false;
	}

	let head  = document.getElementsByTagName("head")[0],
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

module.exports = loadCssJs;