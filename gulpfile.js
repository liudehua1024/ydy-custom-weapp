// 通过gulp4构建小程序脚本
const gulp = require('gulp');
const util = require('gulp-util');
const del = require('del');
const clean = require('gulp-clean');
const changed = require('gulp-changed');
const replace = require('gulp-replace');
const less = require('gulp-less');
const cssmin = require('gulp-clean-css');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const pathUtil = require('path');
const mergeJson = require('gulp-merge-json');

const { watch, series, parallel } = gulp;

const option = {
	base: 'src',
	allowEmpty: true
};

const appConfigPath = ['src/app.json'];

// 除了less/ts外全部复制
const copyPath = ['src/**/*', '!src/app.json', '!src/**/*.less', '!src/**/*.ts'];

const pagesDir = 'src/pages';
const pagesPath = pagesDir + '/**/index.ts';
const indexPageName = 'index';
const pageNameArr = [];

const dist = 'dist';
const lessPath = ['src/**/*.less', 'src/app.less'];
const tsPath = ['src/**/*.ts', 'src/app.ts', '!src/**/*.d.ts'];

const cleanPath = ['dist/**/!(project.config|sitemap).*'];

//复制不包含less/ts的文件
function clear() {
	return gulp.src(cleanPath).pipe(clean());
}

function init() {
	return gulp
	.src(pagesPath)
	.on('data', function(data) {
		const dirName = pathUtil.relative(pagesDir, data.dirname);
		if (pageNameArr.indexOf(dirName) === -1) {
			pageNameArr.push(dirName);
		}
	})
	.on('end', function() {
		pageNameArr.sort((a, b) => {
			switch (indexPageName) {
				case a:
					return -1;
				case b:
					return 1;
				default:
					return 0;
			}
		});
	});
}

function copyAppJson() {
	return gulp
	.src(appConfigPath)
	.pipe(changed(dist))
	.pipe(
		mergeJson({
			filename: 'app.json',
			edit: function(jsonObj) {
				delete jsonObj.pages;
				jsonObj = Object.assign(
					{ pages: pageNameArr.map((value) => 'pages/' + value + '/index') },
					jsonObj
				);
				return jsonObj;
			}
		})
	)
	.pipe(
		rename({
			basename: 'app'
		})
	)
	.pipe(gulp.dest(dist));
}

//复制不包含less/ts的文件
function compileCopy() {
	return gulp
	.src(copyPath, option)
	.pipe(replace(';}}', '}}'))
	.pipe(gulp.dest(dist, { overwrite: true }));
}

//复制不包含less和图片的文件(只改动有变动的文件）
function compileCopyChange() {
	return gulp
	.src(copyPath, option)
	.pipe(changed(dist))
	.pipe(replace(';}}', '}}'))
	.pipe(gulp.dest(dist));
}

function compileLess() {
	return gulp
	.src(lessPath)
	.pipe(less())
	.pipe(cssmin())
	.pipe(
		rename((path) => {
			path.extname = '.wxss';
		})
	)
	.pipe(gulp.dest(dist));
}

//编译less(只改动有变动的文件）
function compileLessChange() {
	return gulp
	.src(lessPath)
	.pipe(changed(dist))
	.pipe(less())
	.pipe(cssmin())
	.pipe(
		rename((path) => {
			path.extname = '.wxss';
		})
	)
	.pipe(gulp.dest(dist));
}

function compileTs() {
	return gulp
	.src(tsPath)
	.pipe(babel()) // 使用babel编译ts
	.pipe(gulp.dest(dist));
}

function compileTsChange() {
	return gulp.src(tsPath).pipe(changed(dist)).pipe(babel()).pipe(gulp.dest(dist));
}

// 监控删除文件或者文件夹
function watchDelete(eventType, filepath) {
	// 只处理删除文件或者文件夹
	if (eventType !== 'unlink' && eventType !== 'unlinkDir') {
		return;
	}
	let distFilepath = filepath.replace('src', dist);
	if (distFilepath.endsWith('.less')) {
		distFilepath = distFilepath.replace(/(.*)less/, '$1wxss');
	} else if (distFilepath.endsWith('.ts')) {
		distFilepath = distFilepath.replace(/(.*)ts/, '$1js');
	}
	del(distFilepath);
}

function pagesChange(eventType, filepath) {
	// 只处理删除文件或者添加文件
	if (eventType !== 'unlink' && eventType !== 'add') {
		return;
	}
	const pathData = pathUtil.parse(filepath);
	if (pathData.base !== 'index.ts') return;
	if (!pathData.dir.startsWith(pagesDir)) return;
	const pageName = pathUtil.relative(pagesDir, pathData.dir);
	const len = pageNameArr.length;
	const index = pageNameArr.indexOf(pageName);
	if (index === -1 && eventType === 'add') {
		if (pageName === indexPageName) {
			pageNameArr.unshift(pageName);
		} else {
			pageNameArr.push(pageName);
		}
	} else if (index !== -1 && eventType === 'unlink') {
		pageNameArr.splice(index, 1);
	}

	if (len !== pageNameArr.length) {
		copyAppJson();
	}
}

function auto() {
	watch(appConfigPath, series(copyAppJson)).on('all', watchDelete);
	watch(copyPath, series(compileCopyChange)).on('all', watchDelete);
	watch(lessPath, series(compileLessChange)).on('all', watchDelete);
	watch(tsPath, series(compileTsChange)).on('all', watchDelete).on('all', pagesChange);
}

const build = parallel(copyAppJson, compileCopy, compileLess, compileTs); // 并行

exports.default = series(clear, init, build, auto); // 顺序执行
