'use strict';

var
  redis = require('redis');

var
  ScanHelper = require('../../../lib/helpers/ScanHelper');

module.exports = function () {
  describe('ScanHelper', function () {

    var
      client;

    before(function () {
      client = redis.createClient();
    });

    it('.scan', function (done) {

      ScanHelper.scan(
        client,
        'SCAN',
        null,
        0,
        '*',
        '100',
        function onMatches(matches, done) {
          console.log(matches);
          expect(matches).to.be.a('array');
          // expect(matches).not.to.be.empty();
          expect(done).to.be.a('function');
          // done(new Error());
          done();
        },
        function onError(error) {
          expect(error).to.be.an.instanceof(Error);
        },
        function onEnd() {
          done(); // mocha done
        }
      );
    });
  });
};
