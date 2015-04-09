'use strict';

var
  _ = require('underscore');

function ScanHelper() {}

ScanHelper.scan = function (client, cmd, key, cursor, pattern, count, onMatches, onError, onEnd) {

  var
    cmdArgs = [],
    onErrorWrapped = function (error) {
      onError(error);
      onEnd();
    };

  if (key) { cmdArgs.push(key); }

  cmdArgs.push(cursor || 0);

  if (pattern) { cmdArgs.push('MATCH', pattern); }
  if (count) { cmdArgs.push('COUNT', count); }

  /* jshint camelcase: false */
  client.send_command(cmd, cmdArgs, function (error, response) {

    if (error) { return onErrorWrapped(error); }

    var
      cursor = parseInt(response[0], 10);

    var
      matches = response[1],
      done = _.once(function (error, isEnded) {
        if (error) { return onErrorWrapped(error); }
        if (cursor === 0 || !! isEnded) { return onEnd(); }
        ScanHelper.scan(client, cmd, key, cursor, pattern, count, onMatches, onError, onEnd);
      });

    onMatches(matches, done);
  });
};

module.exports = ScanHelper;
