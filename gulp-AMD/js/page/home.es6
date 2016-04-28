/**
 * Created by yvan on 16/4/27.
 */
//声明下面的代码是需要jquery这个库的
require(['jquery','urlUtil','eventUtil','util'], function () {
	//console.log(1111);
	$(function () {
		let util = new Util();
		console.log(util.isNumber(1111));
		EventUtil.addHandler($('#test')[0],'click',function(){
			alert(1111)
		});
	});
});