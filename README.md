## artnoot

An artnet server and client implementation for io.js

### Installation

```
$ npm install artnoot
```

### Usage

```
var artnoot = require('artnoot');

/**
 *  Create a new client
 */

var client = new artnoot.Client({
  host: '255.255.255.255', // optional
  port: 6454, // optional
  refresh: 60, // optional - ms to refresh values if supplied
}).connect();

/**
 *  Send a value on a universe and channel
 */

// send on universe 1, channel 23, value 19
client.set(1, 23, 19);

/**
 *  If you want to bail
 */

client.disconnect();
```
