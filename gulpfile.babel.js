import gulp from 'gulp'
import runSequence from 'run-sequence'
require('require-dir')('gulp-tasks');

import { IS_PRODUCTION } from './config'

const buildDeps = [
	'fonts:build',
	'images:build',
	'svg:build',
	'webpack'
];

IS_PRODUCTION
	? gulp.task(
			'build',
			() => runSequence('styles:build', 'html:build'),
			() => runSequence('clean', buildDeps)
		)
	: gulp.task('build', buildDeps);

gulp.task('zip', () => runSequence('clean', buildDeps, 'zip-archive'));

gulp.task('default', [
	'build',
	'watch',
	'browserSync'
]);
