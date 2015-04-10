# node-redis-streamify

A Node.js library to augment [node_redis](https://github.com/mranney/node_redis) interface with streaming version of commands SCAN, HSCAN, SSCAN, ZSCAN.

## Installation

```
npm install node-redis-streamify --save
```

## Usage

```javascript
var
	redis = require('redis');

require('node-redis-streamify')(redis);

var
	scan = redis.streamified('SCAN'); // case insensitive

scan('*')
	.on('data', function (data) {
		// your code here
		// call this.end() if you want to stop scanning
	})
	.on('error', function (error) {
		// your code here
	})
	.on('end', function () {
		// your code here
	});
```

## Supported commands

* [SCAN](http://redis.io/commands/SCAN)
* [HSCAN](http://redis.io/commands/HSCAN)
* [SSCAN](http://redis.io/commands/SSCAN)
* [ZSCAN](http://redis.io/commands/SCAN)

## Streamified API

### SCAN

```javascript
var
	pattern = '*',
	count = 10,
	scan = redis.streamified('SCAN'); // case insensitive

scan(pattern, count)
	.on('data', function (data) {})
	.on('error', function (error) {})
	.on('end', function () {});
```

### HSCAN

```javascript
var
	key = 'path:to:key'
	pattern = '*',
	count = 10,
	hscan = redis.streamified('HSCAN'); // case insensitive

hscan(key, pattern, count)
	.on('data', function (data) {})
	.on('error', function (error) {})
	.on('end', function () {});
```

### SSCAN

```javascript
var
	key = 'path:to:key'
	pattern = '*',
	count = 10,
	sscan = redis.streamified('SSCAN'); // case insensitive

sscan(key, pattern, count)
	.on('data', function (data) {})
	.on('error', function (error) {})
	.on('end', function () {});
```

### ZSCAN

```javascript
var
	key = 'path:to:key'
	pattern = '*',
	count = 10,
	zscan = redis.streamified('ZSCAN'); // case insensitive

zscan(key, pattern, count)
	.on('data', function (data) {})
	.on('error', function (error) {})
	.on('end', function () {});
```

## Alternatives

These are a few alternative projects:

* [redis-scanstreams](https://github.com/brycebaril/redis-scanstreams)
