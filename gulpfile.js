const gulp     = require('gulp');
const ts       = require('gulp-typescript');
const jshint   = require('gulp-jshint');  //js检查
const clean    = require('gulp-clean');   //清空文件夹
// const watchify = require("watchify");   // 变化即时编译
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

let browserifyTs = (filename) => {
	let dstFilename = filename.replace(/\.ts$/,'-bundle.js');
	return browserify({
		basedir: ".",
		debug: true,
		entries: [
			"./src/scripts/ts/" + filename,
		],
		cache: {},
		packageCache: {}
	}).plugin(tsify)
		.bundle()
		.on("error", fancyLog)
		.pipe(source(dstFilename))
		.pipe(gulp.dest("./target/scripts/ts/"));
};

let browserifyTasks = [  ];

// 遍历每一个要被网页引用的ts，生成任务
[ "test-browserify-01.ts",
	"test-browserify-02.ts"
].forEach((o) => {
	browserifyTasks.push(() => { return browserifyTs(o); });
});

gulp.task("browserify-ts", gulp.parallel('build-ts', browserifyTasks));


// 观察文件更新
const watch = require('gulp-watch');

let watchTask = (path, task) => {
	return watch(path, () => {
		console.log(`watch file change: ${path} `);
		gulp.parallel(task)(); 
	});
};

gulp.task('watching', () => {
	watchTask("./src/html/" + "**/*.html", "copy-html");
	watchTask("./src/scripts/ts/" + "**/*.ts", "browserify-ts");
});



// 命令的组合，并行执行
gulp.task('default', gulp.parallel('copy-html', 'browserify-ts'));
gulp.task('develop', gulp.parallel('copy-html', 'browserify-ts', 'watching'));




