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
var VENUS_BINARY = './node_modules/venus/bin/venus';

/**
 * A promise version of node'si child_process.exec
 * @param {string} cmd - Command to execute
 * @returns {object} Promise that will be fulfilled when the command is done
 *          executing
 */
var promisedExec = function(cmd) {
  var def = q.defer();

  cp.exec(cmd, function(err, stdout, stderr) {
    console.log(stderr);
    console.log(stdout);

    if (err) {
      return def.reject();
    }
    def.resolve();
  });

  return def.promise;
};

/**
 * Runs venus for each of the specified files
 * @param {array} files - Files object from grunt multitask
 */
var runVenusForFiles = function(files) {
  var next;

  files.forEach(function(f) {
    f.orig.src.forEach(function(path) {
      var command = VENUS_BINARY + ' run -t ' + path + ' -n';
      if (!next) {
        next = module.exports.promisedExec(command);
      } else {
        next = next.then(function() {
          return module.exports.promisedExec(command);
        });
      }
    });
  });

  return next;
};

module.exports.promisedExec = promisedExec;
module.exports.runVenusForFiles = runVenusForFiles;
