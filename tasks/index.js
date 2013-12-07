'use strict';

module.exports = function (grunt) {
	var _ = grunt.util._;
	var esprima = require('esprima');
	var licenseRegExp = /\bMIT\b|\bGPL\b|\(c\)|License|Copyright/i;
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
			.flatten()
			.uniq()
			.filter(function (hit) {
				return hit;
			}).value()
		;
	}
	function lookupLicense (src) {
		var code = grunt.file.read(src);
		code = code.replace(/[\r\n]+/g, '\n');
		var comments;
		try {
			comments = esprima.parse(code, {
				'comment' : true,
				'loc' : true
			}).comments;
		} catch (e) {
			console.warn('esprima.parse error:', src);
			return;
		}

		var current = {
			'line' : 0,
			'values' : []
		};
		var blocks = comments.map(function (comment) {
			if (comment.type !== 'Line') {
				return comment.value;
			}
			current.line++;
			if (current.line === comment.loc.start.line) {
				current.values.push(comment.value);
				return;
			}
			var values = current.values.join('\n');
			current = {
				'line' : comment.loc.start.line,
				'values' : [comment.value]
			};
			return values;
		});
		blocks.push(current.values.join('\n'));
		return blocks.filter(function (cmm) {
			return cmm && cmm.match && cmm.match(licenseRegExp);
		});
	}
};