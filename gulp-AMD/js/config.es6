/**
 * Created by yvan on 16/4/27.
 */
requirejs.config({
	baseUrl: 'js/',
	paths: {
		jquery: "lib/jquery",
		util: "class/Util.min",
		urlUtil: "class/Url.min",
		router: "module/router.min",
		loadCssJs: "module/loadCssJs.min",
		eventUtil: 'module/eventUtil.min'
	}
});
