const gulp = require('gulp4');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber')



const clean = ()=>del(['./public/js/*.js',
                                './public/html/*.html',
                                './public/css/*.css'],
                                );//удаление старых файлов
const styles =  ()=>{
    return gulp.src('./stylesheets/**/*.less')
        .pipe(plumber())
        .pipe(less())//преобразование less в css
        .pipe(concat('style.min.css'))//склеивание в один файл
        .pipe(cleanCSS())//минификация
        .pipe(gulp.dest('./public/css/'));
}

const scripts = ()=>{
    return gulp.src('./javascripts/*.js')
        .pipe(plumber())
        .pipe(babel())//преобразование с помощью babel
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest('./public/js/'));
}

const html = ()=>{
    return gulp.src(['./views/**/*.pug','!./views/**/layout.pug','!./views/header.pug','!./views/modal_picture.pug'])
        .pipe(plumber())
        .pipe(pug())
        .pipe(gulp.dest('./public/html/'))
}

const watch = ()=>{
    gulp.watch('./bin/www');
    gulp.watch('./views/**/*.pug',html);
    gulp.watch('./stylesheets/**/*.less',styles);
    gulp.watch('./javascripts/*.js',scripts);
}


gulp.task('default',gulp.series(clean,gulp.parallel(styles,scripts,html),watch));