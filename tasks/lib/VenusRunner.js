/*
 * grunt-venus
 * https://github.com/soonick/grunt-venus
 *
 * Copyright (c) 2014 Adrian Ancona Novelo
 * Licensed under the MIT license.
 */

'use strict';

var cp = require('child_process');
var q = require('q');

/**
 * Command that will execute venus binary
 * @type {string}
 */
var VENUS_BINARY = 'venus';

/**
 * A promise version of node'si child_process.exec
 * @param {string} cmd - Command to execute
 * @returns {object} Promise that will be fulfilled when the command is done
 *          executing
 */
var promisedExec = function(args) {
  var def = q.defer();

  var venusCmd = cp.spawn(VENUS_BINARY, args);

  venusCmd.stdout.on('data', function (data) {
    console.log(data.toString());
  });

  venusCmd.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });

  venusCmd.on('close', function (code) {
    console.log('child process exited with code ' + code);
    if (code !== 0) {
      return def.reject();
    }
    def.resolve();
  });

  return def.promise;
};

/**
 * Runs venus for each of the specified files
 * @param {array} files - Files object from grunt multitask
 * @param {array} options
 */
var runVenusForFiles = function(files, options) {
  options = options || {};
  var next;

  files.forEach(function(f) {
    f.orig.src.forEach(function(path) {
      var args = ['run', '-t', path, '-n'];

      if (options.reporter) {
        args.push('--reporter');
        args.push(options.reporter);
      }

      if (!next) {
        next = module.exports.promisedExec(args);
      } else {
        next = next.then(function() {
          return module.exports.promisedExec(args);
        });
      }
    });
  });

  return next;
};

module.exports.promisedExec = promisedExec;
module.exports.runVenusForFiles = runVenusForFiles;
