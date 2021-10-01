// Constants
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const merge = require("merge-stream");
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

function modules() {
  // jQuery files
  let jquery = gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('./assets/js/vendor'));
  // Popper.js JS file
  let popper = gulp.src('./node_modules/@popperjs/core/dist/umd/popper.min.js')
    .pipe(gulp.dest('./assets/js/vendor'));
  // Bootstrap JS files
  let bootstrap_js = gulp.src([
      './node_modules/bootstrap/dist/js/bootstrap.min.js'
      ]
    )
    .pipe(gulp.dest('./assets/js/vendor'));
  // Bootstrap SCSS files
  let bootstrap_scss = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
    .pipe(gulp.dest('./assets/css'));
  // Font Awesome CSS files
  let fontawesome_css = gulp.src('./node_modules/@fortawesome/fontawesome-free/css/all.css')
    .pipe(gulp.dest('./assets/fonts/fontawesome/css'));
  // Font Awesome CSS files
  let fontawesome_fonts = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest('./assets/fonts/fontawesome/webfonts'));
  // Merge streams into one
  return merge(jquery, popper, bootstrap_js, bootstrap_scss, fontawesome_css, fontawesome_fonts);
}

// This function will compile scss files (including bootstrap's scss files) into a single minified css file
function style() {
  return gulp.src('./assets/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/css/'))
    .pipe(browserSync.stream());
}

 // This function will watch for changes on files
function watch() {
  // Create a local server 
  browserSync.init({
    server: {
      baseDir: ".",
      index: "./index.html"
    }
  });
  // If a change is detected in any file SCSS then the style() function will compile them and the browser will automatically reload
  gulp.watch('./assets/scss/**/*.scss', style)
  // If a change in a file is detected then the browser will automatically reload
  gulp.watch('./*.html').on('change',browserSync.reload)
  gulp.watch('../assets/*.js').on('change', browserSync.reload)
}



// Define tasks
const build = gulp.series(modules, style);

// Export tasks
//# Default task - This task will be used when you run "npm run start"
exports.default = build;
// # Watch task - This task will be used when you run "npm run watch"
exports.watch = watch;
