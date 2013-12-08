'use strict';

var grunt = require('grunt');
var _ = grunt.util._;

exports.formatTests = (function () {
	return _.chain({
		'text' : ['text.txt','text.txt'],
		'js' : ['js.js','js.js'],
		'md' : ['md.md','md.md'],
		'missmatch' : ['missmatch.txt','js.js'],
		'autolookup' : ['autolookup.txt','text.txt'],
		'multi_text' : ['multi.txt','text.txt'],
		'multi_js' : ['multi.js','js.js']
	}).pairs().reduce(function (base, pair) {
		var name = pair[0], val = pair[1];
		return (base[name] = function (test) {
			var actual = grunt.file.read('tmp/' + val[0]);
			var expected = grunt.file.read('test/format/' + val[1]);
			test.equal(actual, expected, 'case: ' + name);
			test.done();
		}, base);
	}, {}).value();
})();