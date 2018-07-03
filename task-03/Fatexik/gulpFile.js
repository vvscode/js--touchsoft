/* global require */
/* global gulp */

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browserSynch', function browserSynch() {
    browserSync({
        server: {
            baseDir: "app"
        }
    })
});

gulp.task('browserReload', function browserReload() {
    gulp.src('app/CSS/styles.css')
        .pipe(browserSync.reload({
            stream: true
        }));
    gulp.src('app/index.html')
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('server', ['browserSynch'], function server() {
    gulp.watch('app/CSS/styles.css', ['browserReload']);
    gulp.watch('app/index.html',['browserReload']);
    gulp.watch('app/JS/*.js');
});