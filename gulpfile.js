'use strict';

const SOURCE = './src/';
const DESTINATION = './dist/';
const TEMP = './tmp/';
const VERSION = '1.0.0';
const RELEASE_DATE = (new Date()).toISOString();

var gulp = require('gulp');
var gfi = require("gulp-file-insert");
var plugins = require('gulp-load-plugins')();
var fs = require('fs');
var del = require('del');
var jsdoc2md = require('jsdoc-to-markdown');

const DOC_PREFIX = fs.readFileSync(SOURCE + 'docs/doc-lib-prefix.txt');

gulp.task('default', plugins.sequence(
    'clean',
    'build',
    'lint',
    'doc'
));

gulp.task('build', plugins.sequence(
    [
        'compile-func-default',
        'compile-func-custom',
        'compile-css',
        'compile-examples'
    ],
    'compile-browser-ext'
));

gulp.task('clean', function() {
    return del(DESTINATION + '**/*');
});

gulp.task('lint', function() {
    return gulp.src([
            DESTINATION + '**/*.js',
            '!' + DESTINATION + '**/*.min.js'
        ])
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format())
        .pipe(plugins.eslint.failAfterError());
});

function prerelease(glp) {
    return glp.pipe(plugins.modify({ fileModifier: function(file, contents) {
            return (DOC_PREFIX + contents)
                .replace(/{version}/g, VERSION)
                .replace(/{build-date}/g, RELEASE_DATE);
        }}));
}

gulp.task('compile-css', function() {
    return prerelease(gulp.src(SOURCE + 'css/main.css')
        .pipe(plugins.rename('json-beautify-it-custom.css')))
        .pipe(gulp.dest(DESTINATION));
});

gulp.task('compile-func-default-css', function() {
    return gulp.src(SOURCE + 'css/main.css')
        .pipe(plugins.cssmin())
        .pipe(plugins.modify({ fileModifier: function(file, contents) {
            return contents.replace(/\'/g, '\\\'');
        }}))
        .pipe(gulp.dest(TEMP));
});

gulp.task('compile-func-default-js', function() {
    return prerelease(prerelease(gulp.src(SOURCE + 'js/main.js')
        .pipe(gfi({
            '/* {config-file} */': SOURCE + 'js/config.js',
            '/* {inline-stylesheet} */': SOURCE + 'js/inline-stylesheet.js',
            '{doc-extras}': SOURCE + 'docs/doc-extras.txt'
        })))
        .pipe(gfi({
            '{inline-stylesheet-file}': TEMP + 'main.css'  
        }))
        .pipe(plugins.rename('json-beautify-it.js'))
        .pipe(gulp.dest(DESTINATION))
        .pipe(plugins.uglify())
        .pipe(plugins.rename({ extname: '.min.js' }))
        .pipe(gulp.dest(TEMP)))
        .pipe(gulp.dest(DESTINATION));
});

gulp.task('compile-func-default', plugins.sequence(
    'compile-func-default-css',
    'compile-func-default-js'
));

gulp.task('compile-func-custom', function() {
    return prerelease(gulp.src(SOURCE + 'js/main.js')
        .pipe(gfi({
            '/* {config-file} */': SOURCE + 'js/config-custom.js',
            '{doc-extras}': SOURCE + 'docs/doc-extras.txt'
        }))
        .pipe(plugins.rename('json-beautify-it-custom.js')))
        .pipe(gulp.dest(DESTINATION));
});

function compileExample(file) {
    return gulp.src(SOURCE + 'examples/template.html')
        .pipe(gfi({
            '<!-- JSON -->': SOURCE + 'examples/' + file
        }))
        .pipe(plugins.rename(file.split('.')[0] + '.html'))
        .pipe(gulp.dest(DESTINATION + 'examples/'));
}

gulp.task('compile-examples', function() {
    var files = fs.readdirSync(SOURCE + 'examples');
    for (var i = 0; i < files.length; i++) {
        if (files[i].split('.').pop() === 'json') {
            compileExample(files[i]);
        }
    }
    
    return gulp.src([
            SOURCE + 'examples/*.html',
            '!' + SOURCE + 'examples/template.html'
        ])
        .pipe(gulp.dest(DESTINATION + 'examples/'));
});

gulp.task('browser-ext-copy-files', function() {
    return gulp.src([
            SOURCE + 'browser-ext/**/*.*',
            '!' + SOURCE + 'browser-ext/**/manifest.json'
        ])
        .pipe(gulp.dest(DESTINATION + 'browser-ext/'));
});

gulp.task('browser-ext-manifest', function() {
    return gulp.src(SOURCE + 'browser-ext/**/manifest.json')
        .pipe(plugins.modify({ fileModifier: function(file, contents) {
            return contents.replace(/{version}/g, VERSION);
        }}))
        .pipe(gulp.dest(DESTINATION + 'browser-ext/'));
});

gulp.task('browser-ext-chrome-lib', function() {
    return prerelease(gulp.src(TEMP + 'json-beautify-it.min.js')
        .pipe(plugins.modify({ fileModifier: function(file, contents) {
            return '(' + contents.replace('JSONBeautifyIt', '') + ')(\'pre\');';
        }})))
        .pipe(plugins.rename('json-beautify-run.min.js'))
        .pipe(gulp.dest(DESTINATION + 'browser-ext/chrome/'));
});

gulp.task('compile-browser-ext', plugins.sequence(
    'browser-ext-copy-files',
    'browser-ext-manifest',
    'browser-ext-chrome-lib'
));

/**
 * @link https://github.com/jsdoc2md/jsdoc-to-markdown/wiki/How-to-use-with-gulp
 */
gulp.task('doc', function() {
    if (!fs.existsSync(TEMP)){
        fs.mkdirSync(TEMP);
    }
    const output = jsdoc2md.renderSync({ files: SOURCE + 'js/main.js' })
        .replace('{doc-extras}', '');
    fs.writeFileSync(TEMP + 'function.md', output);
    
    return gulp.src([
            SOURCE + 'docs/intro.md',
            TEMP + 'function.md',
            SOURCE + 'docs/browser-ext-chrome.md',
            SOURCE + 'docs/known-issues.md'
        ])
        .pipe(plugins.concat('README.md'))
        .pipe(gulp.dest('./'));
});