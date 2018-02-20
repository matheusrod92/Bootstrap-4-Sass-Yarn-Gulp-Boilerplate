var gulp = require('gulp'),
    sass = require ('gulp-sass'),
    notify = require('gulp-notify'),
    filter = require('gulp-filter'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin')
    browserSync = require('browser-sync'),
    bulkSass = require('gulp-sass-bulk-import');

var config = {
  stylesPath: 'assets/styles',
  jsPath: 'assets/scripts',
  imagesPath: 'assets/images',
  outputDir: 'public/dist',
  htmlPath: 'public/'
}



gulp.task('icons', function() { 
  return gulp.src('./node_modules/font-awesome/fonts/**.*') 
    .pipe(gulp.dest(config.outputDir + '/fonts')); 
});

gulp.task('images', function() { 
  return gulp.src(config.imagesPath + '/*')
    .pipe(imagemin())
    .pipe(gulp.dest(config.outputDir + '/images'))
});

gulp.task('css', function() {
  return gulp.src(config.stylesPath + '/main.scss')
    .pipe(bulkSass())
    .pipe(sass({
        outputStyle: 'compressed',
        includePaths: [
          config.stylesPath,
          './node_modules/bootstrap/scss',
          './node_modules/font-awesome/scss'
        ]
      }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.outputDir + '/css'))
    .pipe(browserSync.reload({stream:true}));
});


gulp.task('jquery', function(){
  return gulp.src('./node_modules/jquery/dist/jquery.min.js') 
    .pipe(gulp.dest(config.outputDir + '/js')); 
});

gulp.task('popper', function(){
  return gulp.src('./node_modules/popper.js/dist/umd/popper.min.js') 
    .pipe(gulp.dest(config.outputDir + '/js')); 
});

gulp.task('bootstrap-js', function(){
  return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js') 
    .pipe(gulp.dest(config.outputDir + '/js')); 
});

gulp.task('js', function() {
  return gulp.src(config.jsPath+'/*')
    .pipe(filter('**/*.js'))
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.outputDir + '/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('browser-sync', function() {
  browserSync.init(null, {
    server: {
      baseDir: "public"
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('default', ['icons', 'css', 'jquery', 'popper','bootstrap-js', 'js', 'browser-sync'], function() {
  gulp.watch([config.stylesPath + '**/*.scss', config.stylesPath + '**/*.sass', config.stylesPath + '**/*.css'], ['css']);
  gulp.watch([config.jsPath + '**/*.js'], ['js']);
  gulp.watch([config.imagesPath + '/**/*'], ['images']);
  gulp.watch([config.htmlPath + '**/*.html'], ['bs-reload']);
});