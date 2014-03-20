# grunt-venus

> Run JS unit tests using Venus

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-venus --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-venus');
```

## The "venus" task

### Overview
In your project's Gruntfile, add a section named `venus` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  venus: {
    tests: [
      'path/to/test/files'
    ]
  },
});
```
