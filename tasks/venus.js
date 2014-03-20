/*
 * grunt-venus
 * https://github.com/soonick/grunt-venus
 *
 * Copyright (c) 2014 Adrian Ancona Novelo
 * Licensed under the MIT license.
 */

'use strict';

var exec = require('child_process').exec;
var q = require('q');

module.exports = function(grunt) {
  grunt.registerMultiTask('venus', 'Run JS unit tests using venus', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    var done = this.async();
    var venus = './node_modules/venus/bin/venus';

    var promisedExec = function(cmd) {
      var def = q.defer();
      exec(cmd, function(err, stdout, stderr) {
        if (stderr) {
          console.log(stderr);
          def.reject();
        }

        console.log(stdout);

        if (err) {
          return def.reject();
        }
        def.resolve();
      });
      return def.promise;
    };

    var next;
    this.files.forEach(function(f) {
      f.orig.src.forEach(function(path) {
        var command = venus + ' run -t ' + path + ' -n';
        if (!next) {
          next = promisedExec(command);
        } else {
          next = next.then(function() {
            return promisedExec(command);
          });
        }
      });
    });

    next.then(function() {
      done();
    }).catch(function() {
      grunt.log.error('There was an error');
    });
  });
};
