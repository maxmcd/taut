const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const replace = require('gulp-replace');
const nodemon = require('gulp-nodemon');
const cleanCSS = require('gulp-clean-css');
const gzip = require('gulp-gzip');
 
const spawn = require('child_process').spawn;

gulp.task('server', function() {
    return gulp.src(['src/index.js','src/templates.js'])
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(replace(/\\t|\\r/g, '')) // remove whitespace from template strings
    .pipe(replace(/>\\n/g, '>'))
    .pipe(gulp.dest('dist'));    
})
gulp.task('client', () => {
    return gulp.src(['src/client.js'])
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest('dist'));    
})
gulp.task('css', () => {
    return gulp.src('src/app.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gzip())
    .pipe(gulp.dest('dist'));    
})
gulp.task('size', () => {
    return spawn('./bin/size.sh', [], {stdio: "inherit"})
})

gulp.task('build', ['server', 'client', 'css']);

gulp.task('watch', ['build'], function () {
    var stream =  nodemon({
        script: 'dist/index.js',
        watch: 'src', 
        ext: 'js css',
        tasks: ['build'],
    })
    return stream
})