const gulp = require('gulp');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const replace = require('gulp-replace');
const nodemon = require('gulp-nodemon');
const cleanCSS = require('gulp-clean-css');
const gzip = require('gulp-gzip');
 
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

gulp.task('server', function() {
    return gulp.src(['src/index.js'])
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(replace("/\\n/", "wellIsntthisunique"))
    .pipe(replace(/\\t|\\r|\\n/g, '')) // remove whitespace from template strings
    .pipe(replace("wellIsntthisunique", "/\\n/"))
    .pipe(replace(/function\(([a-z, ]+)\)/gi, '($1)=>'))
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('tests'));
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

gulp.task('gzip-index', ()=> {
    let build = exec('node build.js', [], {stdio: "inherit"})
    build.on('error', function(err) {
        console.log(err)
    })
    return build
})

gulp.task('build', ['server', 'client', 'css'], function() {
    exec('node build.js', [], {stdio: "inherit"})
});

gulp.task('watch', ['build'], function () {
    var stream =  nodemon({
        script: 'dist/index.js',
        watch: 'src', 
        ext: 'js css',
        tasks: ['build'],
    })
    return stream
})