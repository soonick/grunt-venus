var cp = require('child_process');
var sinon = require('sinon');

var venusRunner = require('../../../tasks/lib/VenusRunner');

exports.promisedExec = {
  setUp: function(callback) {
    // Stubbing so it doesn't actually print
    sinon.stub(console, 'log');
    this.mockProcess = {
      stdout: {
        on: sinon.spy()
      },
      stderr: {
        on: sinon.spy()
      },
      on: sinon.stub()
    };
    callback();
  },

  tearDown: function(callback) {
    console.log.restore();
    callback();
  },

  returnsPromise: function(test) {
    sinon.stub(cp, 'exec');

    var p = venusRunner.promisedExec();
    test.equals(p.constructor.name, 'Promise');

    cp.exec.restore();
    test.done();
  },

  callsSpawnWithGivenArgs: function(test) {
    sinon.stub(cp, 'spawn').returns(this.mockProcess);

    venusRunner.promisedExec(['hello']);

    test.equals(cp.spawn.args[0][0], 'venus');
    test.deepEqual(cp.spawn.args[0][1], ['hello']);

    cp.spawn.restore();
    test.done();
  },

  rejectsPromiseIfThereIsAnError: function(test) {
    this.mockProcess.on.yields(1);
    sinon.stub(cp, 'spawn').returns(this.mockProcess);

    var p = venusRunner.promisedExec(['hello']);

    test.ok(p.isRejected());

    cp.spawn.restore();
    test.done();
  },

  resolvesPromiseIfThereAreNoErrors: function(test) {
    this.mockProcess.on.yields(0);
    sinon.stub(cp, 'spawn').returns(this.mockProcess);

    var p = venusRunner.promisedExec(['hello']);

    test.ok(p.isFulfilled());

    cp.spawn.restore();
    test.done();
  }
};

exports.runVenusForFiles = {
  setUp: function(callback) {
    var promiseMock = {
      then: sinon.stub().yields()
    };
    sinon.stub(venusRunner, 'promisedExec').returns(promiseMock);
    callback();
  },

  tearDown: function(callback) {
    venusRunner.promisedExec.restore();
    callback();
  },

  callsPromisedExecInOrder: function(test) {
    var files = [
      {
        orig: {
          src: [
            'somePath',
            'anotherPath'
          ]
        }
      },
      {
        orig: {
          src: [
            'hello'
          ]
        }
      }
    ];

    venusRunner.runVenusForFiles(files);

    var args = venusRunner.promisedExec.args;
    test.deepEqual(args[0][0], ['run', '-t', 'somePath', '-n']);
    test.deepEqual(args[1][0], ['run', '-t', 'anotherPath', '-n']);
    test.deepEqual(args[2][0], ['run', '-t', 'hello', '-n']);

    test.done();
  },

  addsReporterParameterIfPassedInOptions: function(test) {
    var options = {
      reporter: 'DotReporter'
    };
    var files = [{
      orig: {
        src: ['hello']
      }
    }];

    venusRunner.runVenusForFiles(files, options);

    var args = venusRunner.promisedExec.args;
    var expected = ['run', '-t', 'hello', '-n', '--reporter', 'DotReporter'];
    test.deepEqual(args[0][0], expected);

    test.done();
  }
};
