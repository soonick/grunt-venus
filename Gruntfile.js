/*
 * grunt-venus
 * https://github.com/soonick/grunt-venus
 *
 * Copyright (c) 2014 Adrian Ancona Novelo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    venus: {
      all: [
        'examples/arrays.spec.js'
      ],
      options: {
        reporter: 'DotReporter'
      }
    },

    nodeunit: {
      all: ['test/**/*_test.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('default', ['jshint', 'venus', 'nodeunit']);
};
