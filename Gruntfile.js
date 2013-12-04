'use strict';

var path = require('path');

module.exports = function(grunt) {
	var files = grunt.file.expand('test/fixtures/*');
	var param = files.reduce(function (obj, file) {
		var base = path.basename(file);
		obj[base] = {
			'src' : [file + '/*.js'],
			'dest' : 'tmp/' + base + '.json'
		};
		return obj;
	}, {});
	grunt.initConfig({
		'nodeunit' : {
			'tests' : ['test/*_test.js']
		},
		'save_license' : param,
		'clean' : {
			'tests' : ['tmp']
		},
		'watch' : {
			'scripts' : {
				'files' : ['./tasks/*', './test/*'],
				'tasks' : ['nodeunit']
			}
		}
	});
	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('test', ['clean', 'save_license', 'nodeunit']);
	grunt.registerTask('testWatch', ['test', 'watch']);
};
