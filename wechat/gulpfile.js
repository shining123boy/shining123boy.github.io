var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-ruby-sass');
// 编译 sass 任务
gulp.task('sass', function() {
    return sass('css/chat.scss')
        .on('error', function(err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('dist/css'));
});
// 定义压缩 image 任务
gulp.task('image', function(){
	gulp.src('src/*.{png,jpg,gif,ico}')
		.pipe(imagemin({
			progressive: true
		}))
		.pipe(gulp.dest('dist/image'));
});
// 定义压缩 css 任务
gulp.task('css', function(){
	gulp.src('dist/css/chat.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'));
});
// 定义压缩js任务
gulp.task('script', function() {
    gulp.src('js/chat.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

});

// 定义自动监控任务
gulp.task('auto', function(){
	// 监听文件修改,当文件被修改执行 script 任务
	gulp.watch('js/*.js', ['script']);
});

// 定义默认任务
gulp.task('default', ['script', 'auto']);
