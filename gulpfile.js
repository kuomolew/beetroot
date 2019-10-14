let gulp = require("gulp"),
    sass = require("gulp-sass");

gulp.task("l08", () => {
    return gulp.src("./08-i-love-design/**/*.scss")  //Путь к файлам, прописывать отдельно!!!!
        .pipe(sass())
        .pipe(gulp.dest((file) => {
            return file.base;
        }));
});

gulp.task("watch", () => {
    return gulp.watch("./08-i-love-design/**/*.scss", gulp.series('l08'));
});

gulp.task("default", gulp.series('compile')); //Запустит дефолтную компиляцию