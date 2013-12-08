/*
 * grunt-license-saver
 *
 * Copyright (c) 2013 kyo_ago
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

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
			var dests = _.isArray(file.dest) ? file.dest : [file.dest || 'licenses.json'];
			dests.forEach(function (dest) {
				var format = lookupFormat(dest, file.format);
				grunt.file.write(dest, formatLicense(licenses, format));
			});
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
	function lookupFormat (dest, format) {
		format = (format || '').toLowerCase();
		if (!_.contains(['text', 'javascript', 'markdown', 'json', ''], format)) {
			console.warn('illegal‎ format. expect:text or javascript or markdown or json, actual:', format);
		}
		var ext = (path.extname(dest) || '').toLowerCase().replace(/^\./, '');
		return format ? format : ({
			'txt' : 'text',
			'js' : 'javascript',
			'md' : 'markdown',
			'json' : 'json'
		})[ext] || 'text';
	}
	function formatLicense (licenses, format) {
		return ({
			'text' : function (licenses) {
				return licenses.join('\n\n');
			},
			'javascript' : function (licenses) {
				return 'var lisences = ' + JSON.stringify(licenses) + ';';
			},
			'markdown' : function (licenses) {
				return licenses.map(function (license) {
					return '```' + license.split(/\r?\n/).join('\n\t') + '\n```';
				}).join('\n\n');
			},
			'json' : function (licenses) {
				return JSON.stringify(licenses, null, '\t');
			}
		})[format](licenses);
	}
};