/*
 * @Author: d12mnit
 * @Date:   2016-05-08 15:55:35
 * @Last modified by:   d12mnit
 * @Last modified time: 2016-05-08T17:00:07+08:00
 * gulp
 * $ npm install gulp gulp-sass gulp-cached gulp-uglify gulp-rename gulp-concat gulp-notify gulp-filter gulp-jshint gulp-rev-append gulp-cssnano gulp-imagemin browser-sync gulp-file-include gulp-autoprefixer del --save-dev
 */

/* jshint node:true */

//load plugins
'use strict';
var gulp = require('gulp'), //引入gulp插件
    del = require('del'), //删除文件
    cached = require('gulp-cached'), //缓存当前任务中的文件，只让已修改的文件通过管道
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    notify = require('gulp-notify'), // 相当于console.log()
    filter = require('gulp-filter'), //过滤筛选文件
    rev = require('gulp-rev-append'), //添加MD5指纹
    cssnano = require('gulp-cssnano'), //css压缩
    imagemin = require('gulp-imagemin'), //图片优化
    browserSync = require('browser-sync'), // 保存自动刷新
    fileinclude = require('gulp-file-include'), // 可以 include html 文件
    autoprefixer = require('gulp-autoprefixer'); // 添加 CSS 浏览器前缀

//css
gulp.task('css', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(cached('css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(filter(['*', '!*.min.css']))
        .pipe(autoprefixer('last 5 version'))
        .pipe(gulp.dest('dist/css'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'))
});
//无刷新实时css预览
gulp.task('styleReload', ['css'], function() {
    return gulp.src(['dist/css/**/*.css'])
        .pipe(cached('style'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
//js
gulp.task('js', function() {
    return gulp.src(['src/js/**/*.js'])
        .pipe(cached('js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(filter(['*'], ['!*.min.js']))
        // .pipe(concat('main.js'))     // js合并
        // .pipe(gulp.dest('dist/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});
//images
gulp.task('image', function() {
    return gulp.src('src/img/**/*.{jpg,jpeg,png,gif}')
        .pipe(cached('image'))
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        .pipe(gulp.dest('dist/img'))
});
//清空dist文件夹
gulp.task('clean', function() {
    return del('dist/**/*');
});

// html 编译 html 文件
gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(fileinclude()) // include html
        .pipe(rev()) // 生成并插入 MD5
        .pipe(gulp.dest('dist/'));
});

// build 需要插入资源指纹（MD5），html 最后执行
gulp.task('build', ['css', 'js', 'image'], function() {
    gulp.start('html');
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: 'dist' // 在 dist 目录下启动本地服务器环境，自动启动默认浏览器
        }
    });
    // 监控 CSS 文件，有变动则执行CSS注入
    gulp.watch('src/css/**/*.css', ['styleReload']);
    // 监控 js 文件，有变动则执行 script 任务
    gulp.watch('src/js/**/*.js', ['js']);
    // 监控图片文件，有变动则执行 image 任务
    gulp.watch('src/img/**/*', ['image']);
    // 监控 html 文件，有变动则执行 html 任务
    gulp.watch('src/**/*.html', ['html']);
    // 监控 dist 目录下除 css 目录以外的变动（如js，图片等），则自动刷新页面
    gulp.watch(['dist/**/*', '!dist/css/**/*']).on('change', browserSync.reload);
});
