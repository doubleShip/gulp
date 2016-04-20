
var gulp        = require('gulp'),
    del         = require('del'),
    pngquant    = require('imagemin-pngquant'),
    browserSync = require('browser-sync'),
    gulpPlugins = require('gulp-load-plugins');

var $ = gulpPlugins();
var cleanSrc = ['./dist/**'],
    htmlSrc = ['*.html'],
    lessSrc = [
        'less/main.less',
        'less/page/*.less'
    ],
    jsSrc = [
        'js/**/*.js'
    ],
    jsConcat = [
        'js/config.js',
        'js/import.js'
    ],
    jsUgly = [
        'js/**/*.js',
        '!./js/lib/*.js',
        '!./js/config.js',
        '!./js/import.js'
    ],
    imgSrc = ['images/*.{png,jpg,gif,ico}'],
    htmlDst = './dist/',
    jsDst = './dist/js',
    jsDev = './dist/jsDev',
    cssDst = './dist/css',
    imgDst = './dist/images';

var deleteDistFile = function(path,cb) {
    var file = path.substr(path.indexOf('demo')+4),
        files = file.split(".");
    if(files[files.length-1] == "js") {
        del(['./dist'+file.substr(0,file.length-2)+'min.js'], cb);
    }
    else if(files[files.length-1] == "css") {
        del(['./dist'+file.substr(0,file.length-3)+'min.css'], cb);
    }
    else {
        del(['./dist'+file], cb);
    }
};

// 清空图片、样式、js
gulp.task('clean', function(cb) {
    //gulp.src(cleanSrc, {read: false})
    //    .pipe(clean({force: true}));
    del(cleanSrc, cb);
});

// HTML处理
gulp.task('html', function() {
    gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDst))
});

// 编译less
gulp.task('less', function () {
    gulp.src(lessSrc)
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.minifyCss())
        .pipe(gulp.dest(cssDst))
});

// 样式处理
//gulp.task('css', function () {
//    var cssSrc = './css/*.css',
//        cssDst = './dist/css';
//
//    gulp.src(cssSrc)
//        .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
//        .pipe($.rename({ suffix: '.min' }))
//        .pipe($.minifyCss())
//        .pipe(gulp.dest(cssDst))
//});

// js处理
gulp.task('js', function () {
    //拼接js
    gulp.src(jsConcat)
        .pipe($.concat('main.js'))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify())
        .pipe(gulp.dest('dist/js'));

    gulp.src(jsUgly)
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe(gulp.dest(jsDev))
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.uglify())
        .pipe(gulp.dest(jsDst));

});

// 图片处理
gulp.task('images', function(){
    gulp.src(imgSrc)
        .pipe($.cache($.imagemin({
            optimizationLevel: 5,
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        })))
        .pipe(gulp.dest(imgDst))
});

// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('build', function(){
    gulp.start('clean','html','less','js','images');
});

// Default task
gulp.task('default', ['build']);

gulp.task('watch', function() {

    //Watch .html files
    gulp.watch(htmlSrc, ['html'])
        .on('change', function(event) {
            if(event.type == "deleted") {
                deleteDistFile(event.path,function(e) {
                    console.log(e)
                });
            }
        });

    //Watch .less files
    gulp.watch(['less/**/*.less'], ['less'])
        .on('change', function(event) {
            if(event.type == "deleted") {
                deleteDistFile(event.path,function(e) {
                    console.log(e)
                });
            }
        });

    // Watch .css files
    //gulp.watch('./css/*.css', ['css']);

    // Watch .js files
    gulp.watch(jsSrc, ['js'])
        .on('change', function(event) {
            if(event.type == "deleted") {
                deleteDistFile(event.path,function(e) {
                    console.log(e)
                });
            }
        });

    // Watch image files
    gulp.watch(imgSrc, ['images'])
        .on('change', function(event) {
            if(event.type == "deleted") {
                deleteDistFile(event.path,function(e) {
                    console.log(e)
                });
            }
        });

    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });

    gulp.watch(['dist/**'])
        .on('change', browserSync.reload);
});