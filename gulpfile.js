"use strict";

let gulp = require('gulp'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

// Browser-sync
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('dev/*.html', ['html']);
    gulp.watch('dev/res/scss/*.scss', ['scss']);
    gulp.watch('dev/res/js/*.js', ['js']);
    gulp.watch('dev/res/sound/*.mp3', ['sound']);
});

// HTML
gulp.task('html', function() {
    gulp.src('./dev/*.html')
        .pipe(gulp.dest('./'));
});

// SCSS
gulp.task('scss', function() {
    gulp.src('./dev/res/scss/*.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./css'));
});

// JavaScript
gulp.task('js', function() {
    gulp.src('./dev/res/js/*.js')
        .pipe(gulp.dest('./js'));
});

// Sound
gulp.task('sound', function() {
    gulp.src('./dev/res/sound/*.mp3')
        .pipe(gulp.dest('./sound'));
});

gulp.task('default', function() {
    gulp.run('browser-sync');
    gulp.run('scss');
    gulp.run('js');
    gulp.run('sound');
    gulp.run('html');

    gulp.watch('*.html').on('change', browserSync.reload);
    gulp.watch('css/*.css').on('change', browserSync.reload);
    gulp.watch('js/*.js').on('change', browserSync.reload);
    gulp.watch('sound/*.mp3').on('change', browserSync.reload);
});
