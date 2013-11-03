'use strict';
module.exports = function (grunt) {
	var _ = grunt.util._;
	var esprima = require('esprima');
	var licenseRegExp = /BSD|MIT|License/i;
	grunt.registerTask('save_license', 'Save the license', function () {
		this.files.forEach(function (file) {
			var valid = file.src.filter(grunt.file.exists.bind(grunt.file));

			_.difference(file.src, valid).forEach(function (filepath) {
				grunt.log.warn('Source file "' + filepath + '" not found.');
			});

			var licenses = valid
				.map(flookupLocenses)
				.filter(function (hit) {
					return hit.license;
				})
			;

			grunt.file.write(file.dest || 'licenses.json', JSON.stringify(licenses, null, '\t'));
		})
	});
	function lookupLocenses (src) {
		var code = grunt.file.read(src);
		var comments = esprima.parse(code, { 'comment' : true }).comments;
		if (!comments.length) {
			return;
		}
		var license = _.chain(comments)
			.map(function (cmm) {
				return cmm.value;
			}).filter(function (cmm) {
				return cmm;
			}).find(function (cmm) {
				return cmm.value.match(licenseRegExp);
			}).value()
		;
		return {
			'file' : src,
			'license' : license
		};
	}
};