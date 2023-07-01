const gulp     = require('gulp');
const ts       = require('gulp-typescript');
const jshint   = require('gulp-jshint');  //js检查
const clean    = require('gulp-clean');   //清空文件夹
const watchify = require("watchify");   // 变化即时编译
const fancyLog = require("fancy-log");
 
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
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");

let browserifyTs = () => {
	return browserify({
		basedir: ".",
		debug: true,
		entries: [
			"./src/scripts/ts/" + "test-browserify.ts"
		],
		cache: {},
		packageCache: {}
	})
	.plugin(tsify);
};
 
// 监控网页脚本的变化，即时编译typescript
let watchedBrowserifyTs = watchify(browserifyTs());

// 绑定编译出的TS到输出文件
let bundleTs = (preStep) => {
	return preStep 
		.bundle()
		.on("error", fancyLog)
		.pipe(source("test-browserify-bundle.js"))
		.pipe(gulp.dest("./target/scripts/ts/"));

};

gulp.task("browserify-ts", gulp.series('build-ts', async () => { 
	await bundleTs(browserifyTs()); 
}));

gulp.task("watch-browserify-ts", gulp.series('build-ts', async () => { 
	await bundleTs(watchedBrowserifyTs); 
}));
 
// 命令的组合，并行执行
gulp.task('default', gulp.parallel('copy-html', 'browserify-ts'));
gulp.task('watching', gulp.parallel('copy-html', 'watch-browserify-ts'));

// 
watchedBrowserifyTs.on("update", gulp.parallel("browserify-ts"));
watchedBrowserifyTs.on("log", fancyLog);


