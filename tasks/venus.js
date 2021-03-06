/*
 * grunt-venus
 * https://github.com/soonick/grunt-venus
 *
 * Copyright (c) 2014 Adrian Ancona Novelo
 * Licensed under the MIT license.
 */

'use strict';

var venusRunner = require('./lib/VenusRunner');

module.exports = function(grunt) {
  grunt.registerMultiTask('venus', 'Run JS unit tests using venus', function() {
    var done = this.async();
    var options = this.options({});

    venusRunner.runVenusForFiles(this.files, options).then(function() {
      done(0);
    })['catch'](function() {
      grunt.log.error('There was an error');
      done(false);
    });
  });
};
