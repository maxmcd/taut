const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const replace = require('gulp-replace');
const cleanCSS = require('gulp-clean-css');
const gzip = require('gulp-gzip');
 
const spawn = require('child_process').spawn;

gulp.task('build', function (cb) {
    gulp.src(['index.js','templates.js'])
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(replace(/\\t|\\r|>\\n/g, '')) // remove whitespace from template strings
    .pipe(gulp.dest('build'));

    gulp.src(['client.js'])
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('build'));

    gulp.src('app.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gzip())
    .pipe(gulp.dest('build'));

    spawn('./bin/size.sh', [], {stdio: "inherit"})
});

