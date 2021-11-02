const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const runSequence = require("run-sequence");
const del = require("del");
const deploy = require("gulp-gh-pages");

// dev
gulp.task("minify-css", () => {
  return gulp
    .src("app/css/*.css")
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("app/css"));
});

gulp.task("sass", () => {
  return gulp
    .src("app/sass/**/*")
    .pipe(sass())
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

gulp.task("browser-sync", () => {
  browserSync.init({
    server: {
      baseDir: "./app",
    },
  });

  gulp.watch("app/sass/**/*", () => {
    runSequence("sass", "minify-css");
  });
  gulp.watch("app/*.html").on("change", browserSync.reload);
});

// build
gulp.task("clean-dist", () => {
  return del.sync("dist");
});

gulp.task("build", () => {
  gulp.series(["clean-dist"]);
  gulp.src("app/index.html").pipe(gulp.dest("dist/"));
  gulp.src("app/css/**/*.css").pipe(gulp.dest("dist/css"));
  return gulp.src("app/img/**/*").pipe(gulp.dest("dist/img"));
});

gulp.task("deploy", () => {
  return gulp.src("./dist/**/*").pipe(deploy());
});

gulp.task("default", gulp.series("browser-sync"));
