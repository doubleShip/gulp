
var gulp        = require('gulp'),
    del         = require('del'),
    pngquant    = require('imagemin-pngquant'),
    browserSync = require('browser-sync'),
    spritesmith = require('gulp.spritesmith'),
    gulpPlugins = require('gulp-load-plugins');

var $ = gulpPlugins();

// js语法检测配置
var jshintConfig = {
    "curly": true, // true: Require {} for every new block or scope
    "eqeqeq": true, // true: Require triple equals (===) for comparison
    "immed": true, // true: Require immediate invocations to be wrapped in parens e.g. `(function () { } ());`
    "latedef": true, // true: Require variables/functions to be defined before being used
    "newcap": true, // true: Require capitalization of all constructor functions e.g. `new F()`
    "noarg": true, // true: Prohibit use of `arguments.caller` and `arguments.callee`
    "sub": true, // true: Prohibit use of empty blocks
    "undef": true, // true: Require all non-global variables to be declared (prevents global leaks)
    "boss": true, // true: Require all defined variables be used
    "eqnull": true, // true: Requires all functions run in ES5 Strict Mode
    "es3": true, // {int} Max number of formal params allowed per function
    "node": true, // {int} Max depth of nested blocks (within functions)
    "-W117": true // {int} Max number statements per function
};

var cleanSrc = ['./dist/**'],
    htmlSrc = ['*.html'],
    sassSrc = [
        'sass/**/*.scss',
        '!./sass/button.scss',
        '!./sass/footer.scss',
        '!./sass/header.scss',
        '!./sass/icon.scss',
        '!./sass/input.scss',
        '!./sass/position.scss',
        '!./sass/reset.scss',
        '!./sass/variables.scss'
    ],
    jsSrc = [
        'js/**/*.{js,es6}'
    ],
    jsConcat = [
        'js/config.{js,es6}',
        'js/base.{js,es6}'
    ],
    jsUgly = [
        'js/**/*.{js,es6}',
        '!./js/lib/*.{js,es6}',
        '!./js/class/*.{js,es6}',
        '!./js/module/*.{js,es6}',
        '!./js/config.{js,es6}'
    ],
    imgSrc = ['images/*.{png,jpg,gif,ico}'],
    htmlDst = './dist/',
    jsDst = './dist/js',
    jsSourceMap = '/maps',
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

// 编译sass
gulp.task('sass', function () {
    gulp.src(sassSrc)
        .pipe($.sass())
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

gulp.task('sprite', function () {
    var spriteData = gulp.src('images/slice/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: 'sprite.less'
    }));
    spriteData.img.pipe(gulp.dest('images/'));
    spriteData.img.pipe(gulp.dest('dist/images/'));
    spriteData.css.pipe(gulp.dest('less/'));
});

// js处理
gulp.task('js', function () {
    gulp.src(jsUgly)
        .pipe($.browserify({ // commonJs转换
            insertGlobals: false
        }))
        .pipe($.babel({modules: 'common'})) //es6转es5
        .pipe($.jshint(jshintConfig))
        .pipe($.jshint.reporter('default'))
        .pipe($.sourcemaps.init())    // 初始化sourcemaps
        .pipe($.rename({ suffix: '.min' }))
        .pipe($.uglify({}))
        .pipe($.sourcemaps.write(jsSourceMap))
        .pipe(gulp.dest(jsDst));

    //拼接js
    //gulp.src(jsConcat)
    //    .pipe($.babel({modules: 'common'})) //es6转es5
    //    .pipe($.browserify({// commonJs转换
    //        insertGlobals: false
    //    }))
    //    .pipe($.concat('app.js'))
    //    //.pipe($.rename({suffix: '.min'}))
    //    .pipe($.uglify())
    //    .pipe(gulp.dest('dist/js'));
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
    gulp.watch(['sass/**/*.scss'], ['sass'])
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