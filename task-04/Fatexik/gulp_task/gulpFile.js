/* exported require */

var gulp = require('gulp');
var include = require('gulp-include');
var minifyCSS = require('gulp-minify-css');
var imageMin = require('gulp-imagemin');
var browserSync = require('browser-sync');


gulp.task('createCss',['minImage'],function(){
    gulp.src('app/CSS/mainCSS.css')
        .pipe(include())
        .pipe(minifyCSS())
        .pipe(gulp.dest("app/Dest"))
        .pipe(browserSync.reload({
            stream:true
        }))
});

gulp.task('updateHTML',['minImage'],function () {
    gulp.src('app/index.html')
        .pipe(browserSync.reload({
            stream:true
        }))
});

gulp.task('minImage',function(){
    gulp.src('app/Image/*.jpg')
        .pipe(imageMin({
            interplaced: true
        }))
        .pipe(gulp.dest("app/Dest/Image"))
});

gulp.task('browserSynch',function(){
    browserSync({
        server:{
            baseDir:"app"
        }
    })
});

gulp.task('server',['browserSynch', 'createCss'],function(){
    gulp.watch('app/CSS/*.css',['createCss']);
    gulp.watch('app/*.html',['updateHTML']);
});