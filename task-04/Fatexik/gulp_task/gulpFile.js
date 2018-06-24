/* global require */
/* global gulp */

var gulp = require('gulp');
var include = require('gulp-include');
var minifyCSS = require('gulp-minify-css');
var imageMin = require('gulp-imagemin');
var browserSync = require('browser-sync');


gulp.task('createCss',['minImage'],function createCSS(){
    gulp.src('app/CSS/mainCSS.css')
        .pipe(include())
        .pipe(minifyCSS())
        .pipe(gulp.dest("app/Dest"))
        .pipe(browserSync.reload({
            stream:true
        }))
});

gulp.task('updateHTML',['minImage'],function updateHTML() {
    gulp.src('app/index.html')
        .pipe(browserSync.reload({
            stream:true
        }))
});

gulp.task('minImage',function minImage(){
    gulp.src('app/Image/*.jpg')
        .pipe(imageMin({
            interplaced: true
        }))
        .pipe(gulp.dest("app/Dest/Image"))
});

gulp.task('browserSynch',function browserSynch(){
    browserSync({
        server:{
            baseDir:"app"
        }
    })
});

gulp.task('server',['browserSynch', 'createCss'],function server(){
    gulp.watch('app/CSS/*.css',['createCss']);
    gulp.watch('app/*.html',['updateHTML']);
});