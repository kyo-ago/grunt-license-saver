'use strict';

var path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		'pkg' : grunt.file.readJSON('package.json'),
		'nodeunit' : {
			'tests' : ['test/*_test.js']
		},
		'save_license' : makeParams(),
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
		var files = grunt.file.expand('test/fixtures/*');
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