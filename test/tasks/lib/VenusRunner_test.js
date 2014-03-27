var cp = require('child_process');
var sinon = require('sinon');

var venusRunner = require('../../../tasks/lib/VenusRunner');


exports.promisedExec = {
  setUp: function(callback) {
    // Stubbing so it doesn't actually print
    sinon.stub(console, 'log');
    callback();
  },

  tearDown: function(callback) {
    console.log.restore();
    callback();
  },

  returnsPromise: function(test) {
    sinon.stub(cp, 'exec');

    var p = venusRunner.promisedExec('ls');
    test.equals(p.constructor.name, 'Promise');

    cp.exec.restore();
    test.done();
  },

  callsExecWithGivenCommand: function(test) {
    sinon.stub(cp, 'exec');

    venusRunner.promisedExec('ls');

    test.equals(cp.exec.args[0][0], 'ls');

    cp.exec.restore();
    test.done();
  },

  rejectsPromiseIfThereIsAnError: function(test) {
    sinon.stub(cp, 'exec').yields(true);

    var p = venusRunner.promisedExec('ls');

    test.ok(p.isRejected());

    cp.exec.restore();
    test.done();
  },

  resolvesPromiseIfThereAreNoErrors: function(test) {
    sinon.stub(cp, 'exec').yields(false);

    var p = venusRunner.promisedExec('ls');

    test.ok(p.isFulfilled());

    cp.exec.restore();
    test.done();
  }
};

exports.runVenusForFiles = {
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
    var promiseMock = {
      then: sinon.stub().yields()
    };
    sinon.stub(venusRunner, 'promisedExec').returns(promiseMock);

    venusRunner.runVenusForFiles(files);

    var args = venusRunner.promisedExec.args;
    test.equals(args[0][0], 'venus run -t somePath -n');
    test.equals(args[1][0], 'venus run -t anotherPath -n');
    test.equals(args[2][0], 'venus run -t hello -n');

    venusRunner.promisedExec.restore();
    test.done();
  }
};
