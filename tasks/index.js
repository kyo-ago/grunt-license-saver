'use strict';

module.exports = function (grunt) {
	var _ = grunt.util._;
	var esprima = require('esprima');
	var licenseRegExp = /\bMIT\b|\bMPL\b|\bGPL\b|\(c\)|License|Copyright/i;
	grunt.registerMultiTask('save_license', 'Save the license', function () {
		this.files.forEach(function (file) {
			var licenses = _.chain(checkFiles(file))
				.map(codeParse)
				.map(lookupLicenses)
				.flatten()
				.uniq()
				.filter(function (hit) {
					return hit;
				}).value()
			;
			var json = JSON.stringify(licenses, null, '\t');
			grunt.file.write(file.dest || 'licenses.json', json);
		})
	});
	function checkFiles (file) {
		var valids = file.src.filter(function (file) {
			return grunt.file.exists(file);
		});
		_.difference(file.src, valids).forEach(function (path) {
			grunt.log.warn('Source file "' + path + '" not found.');
		});
		return valids;
	}
	function codeParse (src) {
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
			return [];
		}
		return comments;
	}
	function lookupLicenses (comments) {
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
		if (current.values.length) {
			blocks.push(current.values.join('\n'));
		}
		return blocks.filter(function (cmm) {
			return cmm && cmm.match && cmm.match(licenseRegExp);
		});
	}
};