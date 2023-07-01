const gulp   = require('gulp');
const ts     = require('gulp-typescript');
const jshint = require('gulp-jshint');  //js检查
const clean  = require('gulp-clean');   //清空文件夹
 
// 复制html文件
gulp.task('clean-html', () => {
	return gulp.src(["./target/" + '**/*.html'], {read: false})
		.pipe(clean());
});
 
gulp.task('copy-html', gulp.series('clean-html', async (callback) => {
	return gulp.src(["./src/html/" + "**/*.html"])
		.pipe(gulp.dest("./target/"));
}));
 
// 编译typescript
gulp.task('clean-ts', () => {
		return gulp.src(["./target/scripts/ts/"], 
			{read: false, allowEmpty: true}).pipe(clean());
});
 
const tsProject = ts.createProject("tsconfig.json");
 
gulp.task('build-ts', gulp.series('clean-ts', () => {
	return gulp.src("./src/scripts/ts/" + '**/*.ts')
		.pipe(tsProject())
		.js
		.pipe(gulp.dest("./target/scripts/ts/"));
}));


// 打包typescript输出为浏览器可用的版本
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");

gulp.task("browserify-ts", gulp.series('build-ts', () => {
	return browserify({
		basedir: ".",
		debug: true,
		entries: [
			"./src/scripts/ts/" + "test-browserify.ts"
		],
		cache: {},
		packageCache: {}
	})
	.plugin(tsify)
	.bundle()
	.pipe(source("bundle-test-page.js"))
	.pipe(gulp.dest("./target/scripts/ts/"));
}));
 
// 命令的组合，并行执行
// gulp.task('default', gulp.parallel('copy-html', 'build-ts'));
gulp.task('default', gulp.parallel('copy-html', 'browserify-ts'));
