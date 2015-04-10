'use strict';

var
  _ = require('underscore');

var
  ScanHelper = require('./helpers/ScanHelper'),
  PullReadable = require('./types/PullReadable');

function _createOnMatches(readable) {
  return function onMatches(matches, done) {

    if (_.isArray(matches) && ! _.isEmpty(matches)) {
      readable.pull.apply(readable, matches);
    }

    done(null, readable.isEnded());
  };
}

function _createOnError(readable) {
  return function onError(error) {
    readable.pull(error);
  };
}

function _createOnEnd(readable) {
  return function onEnd() {
    readable.pull();
  };
}

function _scan(client, cmd, key, pattern, count) {
  var
    readable = new PullReadable(),
    onMatches = _createOnMatches(readable),
    onError = _createOnError(readable),
    onEnd = _createOnEnd(readable);

  ScanHelper
    .scan(client, cmd, key, 0, pattern, count, onMatches, onError, onEnd);

  return readable;
}

function streamify(redis) {

  /* jshint camelcase: false */

  _.extend(redis.RedisClient.prototype, {

    streamified: function (command) {
      var
        methodName = '_streamified_'+command.toLowerCase(),
        method = this[methodName];

      if ( ! _.isFunction(method)) {
        throw new Error('Can\'t find a streaming version of \''+command+'\' command.');
      }

      return _.bind(method, this);
    },

    _streamified_scan: function (pattern, count) {
      return _scan(this, 'SCAN', null, pattern, count);
    },
    _streamified_hscan: function (key, pattern, count) {
      return _scan(this, 'HSCAN', key, pattern, count);
    },
    _streamified_sscan: function (key, pattern, count) {
      return _scan(this, 'SSCAN', key, pattern, count);
    },
    _streamified_zscan: function (key, pattern, count) {
      return _scan(this, 'ZSCAN', key, pattern, count);
    }
  });
}

module.exports = streamify;
