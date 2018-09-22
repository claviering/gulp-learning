const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const pump = require('pump');
const htmlmin = require('gulp-htmlmin');
const less = require('gulp-less');
const path = require('path');
const sass = require('gulp-sass');
const rev = require('gulp-rev');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');

// 压缩js
gulp.task('compress', function (cb) {
  pump([
        gulp.src('js/*.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});

// 压缩css
gulp.task('minify-css', ['merge'], () => {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

// 压缩html
gulp.task('minify', () => {
  return gulp.src('index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

// 编译less
gulp.task('less', () => {
  return gulp.src('./less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./css'));
});

// 编译sass
gulp.task('sass', () => {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

// 文件名加上hash
gulp.task('rev', () =>
    gulp.src('css/*.css')
        .pipe(rev())
        .pipe(gulp.dest('dist'))
);

// css前缀
gulp.task('autoprefixer', ['delCSS', 'sass', 'less'], () =>
    gulp.src('css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
);

// 删除文件
gulp.task('del', () => {
  del('dist/*.*').then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
})

// 删除文件
gulp.task('delCSS', () => {
  del('dist/*.css').then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
})

// 合并css文件
gulp.task('merge', ['autoprefixer'], function() {
  return gulp.src('dist/*.css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/'));
});

// 服务器 压缩html 压缩css 压缩js
gulp.task('serve',['minify', 'minify-css', 'compress'], function() {
  browserSync.init({
      server: {
          baseDir: "./"
      }
  });
  gulp.watch("sass/*.scss", ['minify-css']).on('change', browserSync.reload);
  gulp.watch("less/*.less", ['minify-css']).on('change', browserSync.reload);
  gulp.watch("js/*.js", ['compress']).on('change', browserSync.reload);
  gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
gulp.task('build', [''])