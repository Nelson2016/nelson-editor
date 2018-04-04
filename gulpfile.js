const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const replace = require('gulp-replace');

gulp.task('default', ['script', 'index', 'asset:style', 'asset:font']);

gulp.task('script', function () {
    return gulp.src(['src/views/*.js'])
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(replace('.scss', '.css'))
        .pipe(gulp.dest('dist/views'))
});

gulp.task('index', function () {
    return gulp.src('index.js')
        .pipe(babel({
            presets: ['es2015', 'react']
        }))
        .pipe(replace('./src/asset/style/style.scss', './asset/style/style.css'))
        .pipe(replace('./src/views/Editor', './views/Editor'))
        .pipe(gulp.dest('dist'))
});

gulp.task('asset:style', function () {
    return gulp.src('src/asset/style/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/asset/style'))
});

gulp.task('asset:font', function () {
    return gulp.src('src/asset/font/*')
        .pipe(gulp.dest('dist/asset/font'))
});