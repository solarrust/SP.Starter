import gulp from 'gulp'
import plumber from 'gulp-plumber'
import notifier from 'node-notifier'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import sprites from 'postcss-sprites'
import assets from 'postcss-assets'
import gutil from 'gulp-util'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import cssmin from 'gulp-clean-css';
import gulpif from 'gulp-if'
import path from 'path'
import fs from 'fs'
import modules from 'postcss-modules'
import concat from 'gulp-concat'

import PATHS from '../paths'
import CONFIG from '../config'

function getJSONFromCssModules(cssFileName, json) {
	const cssName       = path.basename(cssFileName, '.css');
	const jsonFileName  = path.resolve('./build', `${ cssName }.json`);
	fs.writeFileSync(jsonFileName, JSON.stringify(json));
}

const PROCESSORS = [
	autoprefixer({
		browsers: ['last 4 versions'],
		cascade: true
	}),
	sprites({
		stylesheetPath: './build/media/css/',
		spritePath: './build/media/img/sprite.png',
		retina: true,
		outputDimensions: true,
		padding: 4,
		filterBy: (image) => /sprites\/.*\.png$/gi.test(image.url)
	}),
	modules({ getJSON: getJSONFromCssModules }),
];

gulp.task('styles:build', () => {
	gulp.src([PATHS.src.styles, PATHS.src.templates  + 'modules/**/*.sass'])
		.pipe(plumber({
			errorHandler: function (err) {
				gutil.log(err.message);
				notifier.notify({
					title: 'SASS compilation error',
					message: err.message
				});
			}
		}))
		.pipe(gulpif(CONFIG.sourcemaps.styles, sourcemaps.init()))
		.pipe(sass({
			outputStyle: 'compact',
			sourceMap: false,
			errLogToConsole: true,
			indentedSyntax: true
		}))
		.pipe(postcss([assets({
			basePath: 'src/',
			// baseUrl: './',
			loadPaths: ['media/img/', 'templates/modules/'],
			relative: true
		})]))
		.pipe(concat('screen.css'))
		.pipe(postcss(PROCESSORS))
		.pipe(gulpif(CONFIG.compress.css, cssmin({processImport: false})))
		.pipe(gulpif(CONFIG.sourcemaps.css, sourcemaps.write()))
		.pipe(gulp.dest(PATHS.build.styles));
});
