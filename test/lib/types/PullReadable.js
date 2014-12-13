'use strict';

var
  PullReadable = require('../../../lib/types/PullReadable');

module.exports = function () {
  describe('PullReadable', function () {
    it('should work', function (done) {

      var
        readable = new PullReadable(),
        array = [ 'a', 'b', 'c', new Error(), 'e', 'f' ],
        lastPulled,
        intervalId;

      readable
        .on('data', function (data) {
          expect(data).to.equal(lastPulled);
        })
        .on('error', function (error) {
          expect(error).to.equal(lastPulled);
          expect(error).to.be.an.instanceof(Error);
        })
        .on('end', function () {
          expect(array).to.deep.equal([ 'e', 'f' ]);
          clearInterval(intervalId);
          done();
        });

      intervalId = setInterval(function () {
        if (array.length > 0) {
          lastPulled = array.shift();
          readable.pull(lastPulled);
        } else {
          readable.pull(null);
        }
      }, 500);
    });
  });
};
