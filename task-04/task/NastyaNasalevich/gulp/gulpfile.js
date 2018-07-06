/* global require */
/* global gulp */

var gulp = require('gulp');
var server = require('gulp-server-livereload');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var clean = require('gulp-clean');

// styles
gulp.task('style', function addStyle() {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix({
            browsers: ['last 15 versions']
        }))
        .pipe(gulp.dest('app/css'));
});

// clean
gulp.task('clean', function clean() {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// build
gulp.task('build', ['clean'], function build() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});

// server
gulp.task('server', function runServer() {
    gulp.src('./app')
        .pipe(server({
            livereload: true,
            port: 4200,
            open: true
        }));
});

gulp.task('watch', function watch(){
    gulp.watch('app/sass/**/*.sass', ['style'])
})

gulp.task('default', ['server', 'watch']);