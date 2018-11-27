/* IMPORTS */
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const bulkSass = require('gulp-sass-bulk-import');
const concat = require('gulp-concat');
const filter = require('gulp-filter');
const gulp = require('gulp');
const gutil = require('gulp-util');
const image = require('gulp-image');
const nunjucks = require('gulp-nunjucks');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');

/* CONFIGS */

const config = {
  stylesPath: 'src/assets/styles',
  jsPath: 'src/assets/scripts',
  imagesPath: 'src/assets/images',
  outputDir: 'public/dist',
  htmlPath: 'public/',
  layoutsPath: 'src/layouts',
};

const tasks = [
  'bundle',
  'css',
  'images',
  'js',
  'layouts',
];

/* ASSETS */

gulp.task('bundle', function () {
  return gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/popper.js/dist/umd/popper.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
  ])
  .pipe(concat('bundle.min.js'))
  .pipe(
    uglify()
      .on('error', function (err) {
        gutil.log(gutil.color.red('[Error]'), err.toString());
        this.emit('end');
      })
  )
  .pipe(gulp.dest(config.outputDir + '/js'));
});

gulp.task('css', function () {
  console.log(`building css at ${Date.now()}`);
  return gulp.src(config.stylesPath + '/main.scss')
    .pipe(bulkSass())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [
        config.stylesPath,
        './node_modules/bootstrap/scss',
        './node_modules/font-awesome/scss',
      ]
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.outputDir + '/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('images', function () {
  return gulp.src(config.imagesPath + '/*')
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: true,
      guetzli: false,
      gifsicle: true,
      svgo: false,
      concurrent: 10,
    }))
    .pipe(gulp.dest(config.outputDir + '/images'))
});

gulp.task('js', function () {
  return gulp.src(config.jsPath + '/*')
    .pipe(filter('**/*.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(
      uglify()
        .on('error', function (err) {
          gutil.log(gutil.color.red('[Error]'), err.toString());
          this.emit('end');
        })
    )
    .pipe(gulp.dest(config.outputDir + '/js'))
    .pipe(browserSync.reload({ stream: true, once: true }));
});

gulp.task('layouts', function () {
  return gulp.src(config.layoutsPath + '/*.html')
    .pipe(nunjucks.compile())
    .pipe(gulp.dest(config.htmlPath))
});

/* LIVE SERVER */

gulp.task('browser-sync', function () {
  browserSync.init(null, {
    server: {
      baseDir: "public"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

/* COMMANDS */

gulp.task('build', tasks);

gulp.task('default', [...tasks, 'browser-sync'], function () {
  gulp.watch([config.stylesPath + '/**/*.scss'], ['css']);
  gulp.watch([config.jsPath + '/**/*.js'], ['js']);
  gulp.watch([config.imagesPath + '/**/*'], ['images']);
  gulp.watch([config.layoutsPath + '/**/*.html'], ['layouts', 'bs-reload']);
});
