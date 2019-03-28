const gulp = require('gulp')
const browserSync = require('browser-sync')


var config = {
  base:   __dirname + '/',
  html:   __dirname + '/**/*.html',
  css:    __dirname + '/css/**/*.css',
  js:     __dirname + '/js/**/*.js',
  img:    __dirname + '/img/**/*'
}

function reload () {
  console.log('reload')
  browserSync.reload()
}

function serve (cb) {
  browserSync({
    server: config.base
  })

  gulp.watch(config.html, reload)
  gulp.watch(config.css, reload)
  gulp.watch(config.js, reload)
  gulp.watch(config.img, reload)

  cb()
}

exports.default = serve
