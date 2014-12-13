'use strict';

var
  chai = require('chai');

global.expect = chai.expect;

var
  lib = require('./lib');

describe('Unit tests', function () {
  lib.helpers.ScanHelper();
  lib.types.PullReadable();
  lib.streamify();
});
