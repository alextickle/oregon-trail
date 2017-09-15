const gulp = require('gulp');
const less = require('gulp-less');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('compile-less', function() {
  gulp
    .src('./src/style.less')
    .pipe(less())
    .pipe(gulp.dest('./public'));
});

gulp.task('watch-less', function() {
  gulp.watch('./src/**/*.less', ['compile-less']);
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './public/'
    }
  });
  gulp.watch('./src/*.less').on('change', reload);
  gulp.watch('./public/*.html').on('change', reload);
});

gulp.task('default', ['watch-less', 'serve']);
s;
