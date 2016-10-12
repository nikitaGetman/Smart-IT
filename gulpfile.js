'use strict';

var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    clean = require('gulp-clean');

// Connect
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});

// Clean
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// Build 
gulp.task('build', ['clean', 'update_vendor_files', 'php'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});

// PHP
gulp.task('php', ['update_vendor_files'], function(){
    gulp.src('app/api/*.*')
        .pipe(gulp.dest('dist/api/'));
    gulp.src('app/api/modules/*.*')
        .pipe(gulp.dest('dist/api/modules/'));    
});

// Update vendor files
gulp.task('update_vendor_files', ['clean'], function(){
    gulp.src('app/bower_components/font-awesome/fonts/*.*')
        .pipe(gulp.dest('dist/fonts/'));
    gulp.src('app/styles/css/img/*.*')
        .pipe(gulp.dest('dist/css/img/'));
});

// Html
gulp.task('html', function(){
    gulp.src('./app/*.html')
    .pipe(connect.reload());
})

// Sass
gulp.task('sass', function () {
  return gulp.src('app/styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/styles/css/'))
    .pipe(connect.reload());
});

// bower
gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('watch', ['connect'], function(){
    gulp.watch('bower.json', ['bower']);
    gulp.watch('app/styles/*.scss', ['sass']);
    gulp.watch('app/*.html', ['html']);
})

