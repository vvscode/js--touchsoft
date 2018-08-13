/* global require */
var gulp = require('gulp');
var inject = require('gulp-js-html-inject');
var minifyJs = require('gulp-minify');
var minifyCss = require('gulp-cssmin');

gulp.task("allJsInFile", ['cssMinify'], function gulpTask() {
    gulp.src(["JS/Chat.js"])
        .pipe(inject({
            basepath: "HTML/component/"
        }))
        .pipe(minifyJs())
        .pipe(gulp.dest("Dev"))
});

gulp.task("cssMinify", function gulpTask() {
    gulp.src("CSS/*.css")
        .pipe(minifyCss())
        .pipe(gulp.dest('Dev'))
});