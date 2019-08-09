const { dest, series, src, task, watch } = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');

/**
 * Prevent errors from stopping the watch function.
 * @param {*} err
 */
function errorHandler(err) {
  this.emit('end');
}

/**
 * Livereload PHP files.
 */
task('php', function() {
  return src('**/*.php')
    .pipe(plumber({ errorHandler }))
    .pipe(livereload());
});

/**
 * Transpile JavaScript with Webpack and Babel.
 */
task('scripts', function() {
  return src('src/scripts/*.js')
    .pipe(plumber({ errorHandler }))
    .pipe(webpack({
      output: { filename: '[name].min.js' },
      module: {
        rules: [{
          test: /\.js$/,
          use: { loader: 'babel-loader' }
        }]
      },
      mode: 'production'
    }))
    .pipe(dest('dist/scripts'))
    .pipe(livereload());
});

/**
 * Compile SCSS into CSS, autoprefix, and minify the final output.
 */
task('styles', function() {
  return src('src/styles/*.sass')
    .pipe(plumber({ errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({ flexbox: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/styles'))
    .pipe(livereload());
});

/**
 * Watch for file changes and run the appropriate tasks.
 */
task('watch', function() {
  watch('**/*.php', series('php'));
  watch('src/scripts/**/*.js', series('scripts'));
  watch('src/styles/**/*.scss', series('styles'));
});

/**
 * Compile everything in one swoop.
 */
task('default', series('php', 'scripts', 'styles'));
