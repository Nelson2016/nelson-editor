const gulp = require('gulp'),
    babel = require('gulp-babel'),
    sass = require('gulp-sass'),
    replace = require('gulp-replace'),
    eslint = require('gulp-eslint'),
    eslintConfig = require('eslint-config');

const lintConfig = eslintConfig({
    isDev: false,
    lintEnv: 'build',
    react: true
});

//---------------编译生产---------------
gulp.task('default', ['script', 'index', 'asset:style', 'asset:font'], () => {
    console.log('编译完成');
});


//ES6、React 转换为 ES5，并替换scss为css
gulp.task('script', () => gulp.src(['src/views/*.js'])
    .pipe(babel({
        presets: ['es2015', 'react']
    }))
    .pipe(eslint(lintConfig))
    .pipe(replace('.scss', '.css'))
    .pipe(gulp.dest('lib/views')));

gulp.task('index', () => gulp.src('index.js')
    .pipe(babel({
        presets: ['es2015', 'react']
    }))
    .pipe(eslint(lintConfig))
    .pipe(replace('./src/asset/style/style.scss', './asset/style/style.css'))
    .pipe(replace('./src/views/Editor', './views/Editor'))
    .pipe(gulp.dest('lib')));

//编译scss
gulp.task('asset:style', () => gulp.src('src/asset/style/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('lib/asset/style')));

//复制静态文件
gulp.task('asset:font', () => gulp.src('src/asset/font/*')
    .pipe(gulp.dest('lib/asset/font')));