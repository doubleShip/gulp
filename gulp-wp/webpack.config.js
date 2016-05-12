var path = require('path');
var webpack = require('webpack');
var fs= require("fs");
var srcDir = './src/'; //资源路径

/**
 * 获取对应文件夹的文件list
 * @param dir
 * @param filelist
 * @param finder
 * @returns {*|Array}
 */
var walkSync = function(dir, filelist, finder) {
    var files = fs.readdirSync(dir);
    finder = finder || "",
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            // 去除不要遍历的文件夹
            if(file == 'page') {
                filelist = walkSync(dir + file + '/', filelist, file);
            }
        }
        else {
            // 过滤.文件
            if(file.indexOf('.') != 0){
                if(finder != "") {
                    file = finder + "/" + file;
                }
                filelist.push(file);
            }
        }
    });
    return filelist;
};

/**
 * 生成entry数据
 * @param finder
 * @returns {{}}
 */
function getEntry(finder) {
    var jsPath = path.resolve(srcDir, finder) + "/",
        matchs = [],
        files = {},
        dirs = walkSync(jsPath);

    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.es6$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, finder, item);
        }
    });
    return files;
}

module.exports = {
    devtool: "source-map",  //生成sourcemap,便于开发调试
    entry: getEntry('js'),      //获取项目入口js文件
    output: {
        path: path.join(__dirname, "dist/js/"), //文件输出目录
        publicPath: "/js/",     //用于配置文件发布路径，如CDN或本地服务器
        chunkFilename: "[name].chunk.js",
        filename: "[name].js"      //根据入口文件输出的对应多个文件名
    },
    module: {
        //各种加载器，即让各种文件格式可用require引用
        loaders: [
            //{ test: /\.es6$/, loader: 'es6-loader' },
            //{ test: /\.js?$/, loaders: ['babel'], exclude: /node_modules/ },
            //使用babel-loader来解析js,es6文件
            { test: /\.(js|es6)$/, loader: 'babel-loader', exclude: /node_modules/ },
            //.css 文件使用 style-loader 和 css-loader 来处理
            //{ test: /\.css$/, loader: 'style!css' },
            //.scss 文件使用 style-loader、css-loader 和 sass-loader 来编译处理
            //对于css文件，默认情况下webpack会把css content内嵌到js里边，运行时会使用style标签内联
            { test: /\.scss$/, loader: 'style!css!sass' },
            //图片文件使用 url-loader 来处理，小于8kb的直接转为base64
            //{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            //图片资源在加载时先压缩，然后当内容size小于~10KB时，会自动转成base64的方式内嵌进去
            //当图片大于10KB时，则会在img/下生成压缩后的图片，命名是[hash:8].[name].[ext]的形式
            //hash:8的意思是取图片内容hushsum值的前8位，这样做能够保证引用的是图片资源的最新修改版本，保证浏览器端能够即时更新
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'image?{bypassOnDebug: true, progressive:true, optimizationLevel: 3, pngquant:{quality: "65-80"}}',
                    'url?limit=10000&name=img/[hash:8].[name].[ext]'
                ]
            },
            {
                test: /\.(woff|eot|ttf)$/i,
                loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
            }
        ]
    },
    resolve: {
        //配置别名，在项目中可缩减引用路径
        alias: {
            jquery: path.join(__dirname, "src/bower_components/jquery/dist/jquery.min.js")
            //core: srcDir + "/js/core",
            //ui: srcDir + "/js/ui"
        }
    },
    plugins: [
        //提供全局的变量，在模块中使用无需用require引入
        //new webpack.ProvidePlugin({
        //    jQuery: "jquery",
        //    $: "jquery"
        //}),
        //将公共代码抽离出来合并为一个文件
        //new webpack.optimize.CommonsChunkPlugin("js/commons.js", ["page3", "admin-commons.js"])
        //js文件的压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};