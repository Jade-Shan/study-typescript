const gulp   = require('gulp');
const ts     = require("gulp-typescript");
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
		return gulp.src(["./target/scripts/"], 
			{read: false, allowEmpty: true}).pipe(clean());
});
 
const tsProject = ts.createProject("tsconfig.json");
 
gulp.task('build-ts', gulp.series('clean-ts', () => {
	return gulp.src("./src/scripts/" + '**/*.ts')
		.pipe(tsProject())
		.js
		.pipe(gulp.dest("./target/scripts/"));
}));
 
// 命令的组合，并行执行
gulp.task('default', gulp.parallel('copy-html', 'build-ts'));
