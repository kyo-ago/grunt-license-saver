'use strict';

var path = require('path');

module.exports = function(grunt) {
	var _ = grunt.util._;

	grunt.initConfig({
		'pkg' : grunt.file.readJSON('package.json'),
		'nodeunit' : {
			'tests' : ['test/*_test.js']
		},
		'save_license' : _.extend(makeParams(), {
			'format_text' : {
				'src' : ['test/format/index.js'],
				'format' : 'text',
				'dest' : 'tmp/text.txt'
			},
			'format_js' : {
				'src' : ['test/format/index.js'],
				'format' : 'JavaScript',
				'dest' : 'tmp/js.js'
			},
			'format_md' : {
				'src' : ['test/format/index.js'],
				'format' : 'Markdown',
				'dest' : 'tmp/md.md'
			},
			'format_json' : {
				'src' : ['test/format/index.js'],
				'format' : 'JSON',
				'dest' : 'tmp/json.json'
			},
			'format_missmatch' : {
				'src' : ['test/format/index.js'],
				'format' : 'JavaScript',
				'dest' : 'tmp/missmatch.txt'
			},
			'format_autolookup' : {
				'src' : ['test/format/index.js'],
				'dest' : 'tmp/autolookup.txt'
			},
			'format_multi' : {
				'src' : ['test/format/index.js'],
				'dest' : ['tmp/multi.txt', 'tmp/multi.js']
			},
		}),
		'clean' : {
			'tests' : ['tmp']
		},
		'watch' : {
			'scripts' : {
				'files' : ['./tasks/*', './test/*'],
				'tasks' : ['nodeunit']
			}
		},
		'release' : {
			'options' : {}
		}
	});
	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-release');

	grunt.registerTask('test', ['clean', 'save_license', 'nodeunit']);
	grunt.registerTask('testWatch', ['test', 'watch']);
    grunt.registerTask('release', ['release:patch']);

	function makeParams () {
		var files = grunt.file.expand('test/index/fixtures/*');
		return files.reduce(function (obj, file) {
			var base = path.basename(file);
			obj[base] = {
				'src' : [file + '/**/*.js'],
				'dest' : 'tmp/' + base + '.json'
			};
			return obj;
		}, {});
	}
};