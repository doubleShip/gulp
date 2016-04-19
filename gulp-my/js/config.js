window.UED_PUBLISH_VERSION = "v2015100201";
window.UED_SUB_PUBLISH_VERSION = "1.0";
window.UED_Souce ={
	'commonCss.css' : [
		'main.min.css'
	],
	'commonJs.js' : [
		'page/main.js'
	],
	'indexJs.js' : [
		'module/info-panel.js'
	]
};

var Config = {
	publishVersion: window.UED_PUBLISH_VERSION || "",
	subPublishVersion: window.UED_SUB_PUBLISH_VERSION || "",
	resource: window.UED_Souce,
	language: navigator.language || navigator.browserLanguage,
	cdnJquery: false,
	cdnPath: "",
	mode: 'online' // dev/online
};