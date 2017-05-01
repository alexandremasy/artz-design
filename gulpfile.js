var gulp = require('gulp');
var connect = require('gulp-connect');

///////////////////////////////////////////////////////////////////

/**
 *  Pug Filter :code
 *  Code filter to be able to add code documentation in a pug file
 *
 *  @param block String
 **/
function codeFilter(block)
{
  return block
      .replace( /&/g, '&amp;'  )
      .replace( /</g, '&lt;'   )
      .replace( />/g, '&gt;'   )
      .replace( /"/g, '&quot;' )
      .replace( /#/g, '&#35;'  )
      .replace( /\\/g, '\\\\'  )
      .replace( /\n/g, '<br>'   );
}

///////////////////////////////////////////////////////////////////

/**
 *  Task: Styles [dev]
 *  Build the sass files for development
 *
 *  @version 1.1
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('styles.dev', function(){
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');

  gulp.src(['src/styles/app.scss', 'src/styles/styleguide.scss'])
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('build/statics/styles/'))
    .pipe(connect.reload())
    ;
});

/**
 *  Task: Styles [prod]
 *  Build the sass files for production
 *
 *  @version 1.1
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('styles.prod', function(){
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');

  gulp.src(['src/styles/app.scss', 'src/styles/styleguide.scss'])
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('build/statics/styles/'))
  ;
});

/**
 *  Task: Styles [watch]
 *  Watch & build the sass files for development
 *
 *  @version 1.2
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('styles.watch', ['styles.dev'], function()
{
  gulp.watch(['src/styles/**/*.scss'], ['styles.dev']);
})

///////////////////////////////////////////////////////////////////

/**
 *  Task: Libs [dev]
 *  Build the libraries for development
 *
 *  @version 1.1
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('libs.dev', function(){
  var rename = require('gulp-rename');
  var concat = require('gulp-concat');
  var plumber = require('gulp-plumber');

  return gulp.src('src/libs/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build/statics/libs/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/libs/'))
    .pipe(connect.reload())
  ;
});

/**
 *  Task: Libs [prod]
 *  Build the libraries for production
 *
 *  @version 1.1
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('libs.prod', function(){
  var rename = require('gulp-rename');
  var uglify = require('gulp-uglify');
  var concat = require('gulp-concat');
  var plumber = require('gulp-plumber');

  return gulp.src('src/libs/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build/statics/libs/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/statics/libs/'))
  ;
});

/**
 *  Task: Libs [watch]
 *  Watch & build the libraries for development
 *
 *  @version 1.2
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('libs.watch', ['libs.dev'], function()
{
  gulp.watch(['src/libs/**/*.js'], ['libs.dev']);
})

///////////////////////////////////////////////////////////////////

/**
 *  Task: Views [production & development]
 *  Build the pugjs files for production & development
 *
 *  @version 1.1
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('views', function()
{
  var gulpPug = require('gulp-pug');

  // return gulp.src(['src/views/index.pug', 'src/views/styleguide/**/*.pug'])
  return gulp.src(['src/views/pages/**/*.pug', 'src/views/styleguide/**/*.pug'])
    .pipe(gulpPug({pretty: true, filters:{'code':codeFilter}}))
    .pipe(gulp.dest('build/'))
    .pipe(connect.reload())
  ;
});

/**
 *  Task: Views [watch]
 *  Watch & build the pugjs files for production & development
 *
 *  @version 1.2
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('views.watch', ['views'], function()
{
  gulp.watch(['src/views/**/*.pug'], ['views']);
})

///////////////////////////////////////////////////////////////////

/**
 *  Task: Statics
 *  Copy the statics files from the sources to the build folder
 *
 *  @version 1.0
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('statics', function()
{
  return gulp.src(['src/statics/**'])
    .pipe(gulp.dest('build/statics/'));
});

/**
 *  Task: Clean
 *  Start fresh - Delete all the build files
 *
 *  @version 1.1
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('clean', function()
{
  var del = require('del');
  return del(['build/*']);
})

///////////////////////////////////////////////////////////////////

/**
 *  Task: Connect
 *  Create a local server to work with. Isn't it nice ?
 *
 *  @version 1.1
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('connect', function()
{
  connect.server({
    root:'build/',
    livereload: true
  });
});

///////////////////////////////////////////////////////////////////

/**
 *  Task: Watch
 *  Watch for file change and trigger the proper workflow.
 *
 *  @version 1.1
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('watch', ['clean'], function()
{
  gulp.start(['styles.watch', 'libs.watch', 'views.watch', 'statics', 'connect']);
});

/**
 *  Task: Dev
 *  Create a development build of the sources
 *
 *  @version 1.0
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('dev', ['clean'], function()
{
  gulp.start(['styles.dev', 'libs.dev', 'views', 'statics']);
});

/**
 *  Task: Prod
 *  Create a production build of the sources
 *
 *  @version 1.0
 *  @author Alexandre Masy <hello@alexandremasy.com>
 **/
gulp.task('prod', ['clean'], function()
{
  gulp.start(['styles.prod', 'libs.prod', 'views', 'statics']);
});

///////////////////////////////////////////////////////////////////

gulp.task('default', function()
{
  var gutil = require('gulp-util');

  gutil.log();
  gutil.log('-----------------------------------');
  gutil.log(gutil.colors.green('Alexandre Masy - Build'));
  gutil.log(gutil.colors.green('Version: 1.0'));
  gutil.log();
  gutil.log(gutil.colors.green('Usage: gulp <command>'));
  gutil.log(gutil.colors.green('Where <command> is:'));
  gutil.log(gutil.colors.red('$ gulp dev') + gutil.colors.blue(' - Create a development build of the sources'));
  gutil.log(gutil.colors.red('$ gulp prod') + gutil.colors.blue(' - Create a production build of the sources'));
  gutil.log(gutil.colors.red('$ gulp watch') + gutil.colors.blue(' - Watch for file change and trigger the proper workflow.'));
  gutil.log();
  gutil.log('-----------------------------------');
  gutil.log();
});
