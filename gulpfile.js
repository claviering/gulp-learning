const gulp = require('gulp')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const pump = require('pump');
const htmlmin = require('gulp-htmlmin')
const less = require('gulp-less')
const path = require('path')
const sass = require('gulp-sass')
const rev = require('gulp-rev')
const autoprefixer = require('gulp-autoprefixer')
const del = require('del')
const browsersync = require('browser-sync').create()
const concat = require('gulp-concat')
const rename = require('gulp-rename')

const paths = {
  baseDir: './dev/',
  html: {
    src: './src/index.html',
    dev: './dev/',
    pro: './dist/'
  },
  style: {
    src: './src/less/*.less',
    dev: './dev/',
    pro: './dist/'
  },
  script: {
    src: './src/js/*.js',
    dev: './dev/',
    pro: './dist/'
  }
}

function html (done) {
  done()
  return gulp
    .src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.pro))
}

function style (done) {
  done()
  return gulp
    .src(paths.style.src)
    .pipe(less()).on('error', console.error.bind(console))
    .pipe(autoprefixer())
    .pipe(cleanCSS({level: 2}))
    .pipe(gulp.dest(paths.style.pro))
}

function script (done) {
  done()
  return pump([
    gulp.src(paths.script.src),
    uglify(),
    gulp.dest(paths.script.pro)
  ])
}

function css (done) {
  done()
  return gulp
  .src(paths.style.src)
  .pipe(less())
  .pipe(autoprefixer())
  .pipe(gulp.dest(paths.style.dev))
}

function js (done) {
  done()
  return gulp
  .src(paths.script.src)
  .pipe(gulp.dest(paths.script.dev))
}

function htmldev (done) {
  done()
  return gulp
  .src(paths.html.src)
  .pipe(gulp.dest(paths.html.dev))
}

function clean() {
  return del(['./dist/'])
}

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: paths.baseDir
    },
    port: 3000
  })
  done()
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload()
  done()
}

// Watch files
function watchFiles(done) {
  done()
  gulp.watch(paths.style.src, gulp.series(css, browserSyncReload))
  gulp.watch(paths.script.src, gulp.series(js, browserSyncReload))
  gulp.watch(paths.html.src, gulp.series(htmldev, browserSyncReload))
}

gulp.task('build', gulp.series(clean, gulp.parallel(html, style, script)))
gulp.task('default', gulp.series(gulp.parallel(htmldev, js, css), browserSync, watchFiles))