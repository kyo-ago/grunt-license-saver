'use strict';

module.exports = function (grunt) {
	var _ = grunt.util._;
	var esprima = require('esprima');
	var licenseRegExp = /MIT|GPL|License/i;
	grunt.registerMultiTask('save_license', 'Save the license', function () {
		this.files.forEach(function (file) {
			var validFiles = file.src.filter(function (file) {
				return grunt.file.exists(file);
			});

			_.difference(file.src, validFiles).forEach(function (filepath) {
				grunt.log.warn('Source file "' + filepath + '" not found.');
			});

			var json = JSON.stringify(fileToLicenses(validFiles), null, '\t');

			grunt.file.write(file.dest || 'licenses.json', json);
		})
	});
	function fileToLicenses (files) {
		return _.chain(files)
			.map(lookupLicense)
			.uniq()
			.filter(function (hit) {
				return hit;
			}).value()
		;
	}
	function lookupLicense (src) {
		var code = grunt.file.read(src);
		var ast = esprima.parse(code, { 'comment' : true });
		return _.chain(ast.comments)
			.map(function (cmm) {
				return cmm.value;
			}).filter(function (cmm) {
				return cmm;
			}).find(function (cmm) {
				return cmm.match(licenseRegExp);
			}).value()
		;
	}
};