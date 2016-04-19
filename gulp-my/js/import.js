/**
 * 静态文件加载器 - v0.1.2 - 2015-11-25
 * Copyright (c) 2015 Young Foo
 */

var Application = function(config){

    //私有变量less，css，js模板
    var __jsTemplate = '<script src="${src}" charset="utf-8" type="text/javascript"><\/script>',
    __cssTemplate = '<link rel="stylesheet" type="text/css" href="${href}" />';

    //配置
    this.config = {};

    //cdn path
    this.cdnPath = "";

    //dist path
    this.distPath = "";

    /**
     * 装载配置文件
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    this.configure = function(conf){
        this.config = conf;
    };

    /**
     * 初始化导入
     * @return {[type]} [description]
     */
    this.initImport = function(){

        this.cdnPath = this.config.cdnPath || "";
        this.distPath = this.config.cdnPath || "";

    };

    /**
     * [__importDist 导入debug文件]
     * @param  {[type]} files    [文件数组]
     * @param  {[type]} fileType [文件类型]
     * @param  {[type]} id       [文件id]
     * @return {[type]}          [null]
     */
    var __importAllFile = function(files, fileType, mode, ins, isHead) {
        for(var i = 0; i < files.length; i++) {

            var outStr = '',
                _filepath  = '';

            if(mode == 'dev' && fileType == "js") {
                _filepath = "/jsDev/" + files[i];
            }
            else {
                _filepath = ins.distPath + "/js/" + files[i].substr(0,files[i].lastIndexOf(".")) + ".min.js";
            }

            if (fileType == "js") {

                outStr = __jsTemplate.replace("${src}", _filepath + "?v=" + ins.config.subPublishVersion);

            } else if (fileType == "css") {

                outStr = __cssTemplate.replace("${href}", ins.distPath + "/css/" + files[i] + "?v=" + ins.config.subPublishVersion);

            }

            if(isHead){
                ins.asyncImportJs(ins.cdnPath + files[i]);
            }else{
                document.write(outStr);
            }
        }

    };

    /**
     * @function importFile 导入文件
     * @param id 静态文件的id名称
     * @param fileType  文件类型  js/css
     * @param mode 运行环境 dev/online dev表示环境加载多个源码文件 online代表线上环境 加载单个合并压缩后的文件
    */
    this.importFile = function(id, fileType, mode, isHead) {

        var __mode = this.config.mode,
            __id = id +'.' + fileType;

        //判断是否有指定模式
        if (mode) {
            __mode = mode;
        }

        //判断resource数组是否为空
        if (!this.config.resource[__id]) {
            return false;
        }

        __importAllFile(this.config.resource[__id], fileType, __mode, this, isHead)
    };

    /** 
     * @function asyncImport 异步导入
     * @param src js的路径
    */
    this.asyncImportJs = function(src, charset) {
        
        var head = document.getElementsByTagName("head")[0];

        //创建script
        var script = document.createElement("script");
        script.type = "text/javascript";

        //设置为异步
        script.async = true;
        script.src = src;


        //charset设置
        if (charset) {
            script.charset = charset;
        }

        //防止没有head标签的情况
        if (!head) {
            document.body.insertBefore(script, document.body.firstChild);
        } else {
            head.appendChild(script);
        }
    };

    /**
     * 构造函数
     * @return {[type]} [description]
     */
    this.init = function(conf){

        //初始化配置文件
        this.configure(conf);

        //导入配置文件
        this.initImport();

    };

    //初始化
    this.init(config);

};

var app = new Application(window.Config);

