// Include gulp
var gulp = require('gulp'); 

// include our plugins ,same as package.json
var jshint       = require('gulp-jshint');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var browserify   = require('gulp-browserify');
var watch        = require('gulp-watch');
var header       = require('gulp-header');
var open         = require("gulp-open");
var tinylr       = require('tiny-lr');
var express      = require('express');
var livereload   = require('gulp-livereload');
// var of project
var pathFromHtml = "views";
var pathFromJs   = "public/js";
var pathFromCss  = "public/css";
// destination path of all yours files
var pathToCss    = "build/sources/css";
var pathToHtml   = "build/";
var pathToJs     = "build/sources/js";
var PathToServer = "build/";

// start server html on local host
var server       = tinylr();
var app = express();
    app.use(express.static(PathToServer));
    app.listen(8080, function() {
      console.log('Listening on', 8080);
    });

server.listen(35729, function (err) {
      if (err) return console.log(err);

      
    gulp.watch([
                "./"+pathFromJs+'/**/*.js',
                './views/**/*.html',
                "./"+pathFromCss+'/**/*.css'],
        function(){
                    gulp.start('insertVar');
                    gulp.start('lint');
                    gulp.start('browserify');
                    gulp.start("ConstructCss");
                    gulp.start("ConstructHtml");
                    
                });      
    });

// Lint Task
gulp.task('lint', function() {
    return gulp.src(pathFromJs+'/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('browserify', function() {
    return gulp.src(pathFromJs+'/main.js')
        .pipe(browserify({
          insertGlobals : false,
          debug : !gulp.env.production
        }))
        .pipe(gulp.dest(pathToJs))
        .pipe(livereload(server));
});

// use use strict no good yet
gulp.task('insertVar', function() {
    // return gulp.src(pathFromJs+'/main.js')
    // .pipe(header("use strict ;"));
});
// move html to good place
gulp.task('ConstructHtml',function(){
   return gulp.src(pathFromHtml+"/**/*.html")
    .pipe(gulp.dest(pathToHtml))
    .pipe(livereload(server));
});

// move css to good place
gulp.task('ConstructCss',function(){
   return gulp.src(pathFromCss+"/**/*.css")
    .pipe(gulp.dest(pathToCss))
    .pipe(livereload(server));
});

// Default Task
gulp.task('default', ['insertVar', 'lint','browserify',"ConstructHtml","ConstructCss"],function(){
  // Open Google Chrome @ localhost:8080
  gulp.src('./build/index.html')
    .pipe(open("",{
      // app:"google-chrome",
      app:"/usr/lib/chromium-browser/chromium-browser",
      url: "http://localhost:8080/"
}))});

