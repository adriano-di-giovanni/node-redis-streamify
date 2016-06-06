'use strict';

var
  _ = require('underscore'),
  async = require('async'),
  redis = require('redis');

require('../../lib/streamify')(redis);

module.exports = function () {
  describe('streamify', function () {

    var
      client;

    before(function () {
      client = redis.createClient();
    });

    it('should be streamified', function () {
      expect(client.streamified).to.be.a('function');
    });

    it('should throw error', function () {
      expect(function () { client.streamified('DEL'); }).to.throw(Error);
    });

    it('#streamified(\'SCAN\')', function (done) {

      var
        scan = client.streamified('SCAN'),
        iteration = 1;

      scan('*', 1)
        .on('data', function (data) {
          var
            context = this;
          console.log(iteration, data);
          this.pause();
          console.log(iteration, 'paused');
          setTimeout(function () {
            context.resume();
            console.log(iteration, 'resumed');
          }, 1000);
          expect(data).to.be.a('string');
        })
        .on('error', function (error) {
          expect(error).to.be.an.instanceof(Error);
        })
        .on('end', function () {
          console.log('end');
          done();
        });
    });

    it('#streamified(\'HSCAN\')', function (done) {

      var
        now = Date.now(),
        key = 'streamify:hash:'+now,
        hash = {
          a: 0,
          b: 1,
          c: 2,
          d: 3,
        };

      async.series(
        [
          function (callback) {

            var
              multi = client.multi();

            _.each(hash, function (value, field) {
              multi
                .hset(key, field, value);
            });

            multi
              .exec(function (error) {
                callback(error);
              });
          },
          function (callback) {
            var
              hscan = client.streamified('HSCAN');

            hscan(key, '*')
              .on('data', function (data) {
                expect(data).to.be.a('string');
              })
              .on('error', function (error) {
                expect(error).to.be.an.instanceof(Error);
              })
              .on('end', function () {
                callback();
              });
          },
          function (callback) {
            client.DEL(key, function (error) {
              callback(error);
            });
          }
        ],
        function (error) {
          done(error);
        }
      );
    });

    it('#streamified(\'SSCAN\')', function (done) {

      var
        now = Date.now(),
        key = 'streamify:set:'+now,
        set = [ 'a', 'b', 'c', 'd' ];

      async.series(
        [
          function (callback) {

            var
              multi = client.multi();

            _.each(set, function (member) {
              multi
                .sadd(key, member);
            });

            multi
              .exec(function (error) {
                callback(error);
              });
          },
          function (callback) {
            var
              hscan = client.streamified('SSCAN');

            hscan(key, '*')
              .on('data', function (data) {
                expect(data).to.be.a('string');
                expect(set).to.include.members([ data ]);
              })
              .on('error', function (error) {
                expect(error).to.be.an.instanceof(Error);
              })
              .on('end', function () {
                callback();
              });
          },
          function (callback) {
            client.DEL(key, function (error) {
              callback(error);
            });
          }
        ],
        function (error) {
          done(error);
        }
      );
    });

    it('#streamified(\'ZSCAN\')', function (done) {

      var
        now = Date.now(),
        key = 'streamify:set:'+now,
        zset = [ 'a', 'b', 'c', 'd' ];

      async.series(
        [
          function (callback) {

            var
              multi = client.multi();

            _.each(zset, function (member, score) {
              multi
                .zadd(key, score, member);
            });

            multi
              .exec(function (error) {
                callback(error);
              });
          },
          function (callback) {
            var
              hscan = client.streamified('ZSCAN');

            hscan(key, '*')
              .on('data', function (data) {
                expect(data).to.be.a('string');
              })
              .on('error', function (error) {
                expect(error).to.be.an.instanceof(Error);
              })
              .on('end', function () {
                callback();
              });
          },
          function (callback) {
            client.DEL(key, function (error) {
              callback(error);
            });
          }
        ],
        function (error) {
          done(error);
        }
      );
    });
  });
};
