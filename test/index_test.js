'use strict';

var grunt = require('grunt');
var path = require('path');
var fs = require('fs');

exports.saveLicense = (function () {
	var files = grunt.file.expand('test/fixtures/*');
	return files.reduce(function (obj, file) {
		var base = path.basename(file);
		obj[base] = function (test) {
			var actual = grunt.file.read('tmp/' + base + '.json');
			var expected = grunt.file.read('test/expected/' + base + '/expect.json');
			test.equal(actual, expected, 'case:' + base);
			test.done();
		};
		return obj;
	}, {});
})();