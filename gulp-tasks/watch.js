import gulp from 'gulp'
import watch from 'gulp-watch'
import runSequence from 'run-sequence'

import PATHS from '../paths'

gulp.task('watch', () => {
	watch([PATHS.watch.nunj], (event, cb) => gulp.start('html:build'));
	watch([PATHS.watch.styles, PATHS.src.templates + 'modules/**/*.sass'], (event, cb) => runSequence('styles:build', 'html:build'));
	watch([PATHS.watch.images], (event, cb) => gulp.start('images:build'));
	watch([PATHS.watch.svg], (event, cb) => gulp.start('svg:build'));
	watch([PATHS.watch.fonts], (event, cb) => gulp.start('fonts:build'));
});
