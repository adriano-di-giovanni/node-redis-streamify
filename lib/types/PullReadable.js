'use strict';

var
  util = require('util');

var
  Readable = require('stream').Readable;

function PullReadable() {

  Readable.call(this, { objectMode: true });

  this._isCallRead = false;
  this._array = [];
}

util.inherits(PullReadable, Readable);

PullReadable.prototype._read = function () {

  var
    array = this._array,
    element;

  if (array.length > 0) {

    element = array.shift();

    if (element instanceof Error) {
      this.emit('error', element);
      element = null;
    }

    this.push(element);
  } else {
    // the `_read()` function won't be called again until at least one `push(chunk)` call is made
    // so it's up to `pull()` function to invoke `_read()` again if needed
    this._isCallRead = true;
  }
};

PullReadable.prototype.pull = function () {

  var
    array = this._array;

  if (arguments.length > 0) {
    array.push.apply(array, arguments);
  } else {
    array.push(null);
  }

  if (this._isCallRead) {
    this._isCallRead = false;
    this._read();
  }
};

PullReadable.prototype.end = function () {
  this._isEnded = true;
};

PullReadable.prototype.isEnded = function () {
  return !! this._isEnded;
};

module.exports = PullReadable;
