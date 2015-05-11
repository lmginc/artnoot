'use strict';

var dgram = require('dgram');

/**
 *  noop
 */

function noop() {};

/**
 *  Expose `Artnet`
 */

module.exports = Artnet;

function Artnet(opts) {
  var opts = opts || {};

  this.host = opts.host || '255.255.255.255';
  this.port = opts.port || 6454;
  this.refresh = opts.refresh || 0;

  this.header =  [65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14, 0, 0, 1, 0, 2, 0];

  this.socket = null;
  this.interval = null;
  this.timer = null;

  this.data = [];
};

/**
 *  Connect to host
 */

Artnet.prototype.connect = function connect() {
  this.socket = dgram.createSocket('udp4');

  this._startInterval();
  
  return this;
};

/**
 *  Close a connection
 *
 *  @param {Function} callback - optional
 */

Artnet.prototype.disconnect = function disconnect(callback) {
  callback = callback || noop;

  var self = this;

  this.socket && this.socket.close(function() {
    self.socket = null;
    callback();
  });

  return this;
};

/**
 *  Start the interval
 *
 *  @param {Number} interval
 */

Artnet.prototype._startInterval = function _startInterval(interval) {

  if (interval) this.interval = interval;

  if (!this.interval || this.interval < 50) return null;

  var self = this;

  this.timer = setInterval(function() {
    self._send();
  }, this.interval);

  return this.timer;
}

/**
 *  Stop the interval
 */

Artnet.prototype._stopInterval = function _startInterval() {
  if (!this.timer) return null;

  clearInterval(this.timer);
};

/**
 *  Set a value
 *
 *  @param {Number} universe
 *  @param {Number} channel
 *  @param {Number} value
 */

Artnet.prototype.set = function set(universe, channel, value) {

  if (value < 0) value = 0;
  if (value > 255) value = 255;

  if (channel < 0) channel = 0;
  if (channel > 512) channel = 512;
  
  if (!this.data[universe]) this.data[universe] = _createUniverse();

  this.data[universe][channel] = value;

  this._send();
};

/**
 *  Transmit the data
 */

Artnet.prototype._send = function _send() {

  this.data.forEach(function(universe, uIndex){

    this.header[14] = uIndex;

    var data = this.header.concat(this.data[uIndex]);
    var buff = new Buffer(data);

    this.socket.send(buff, 0, buff.length, this.port, this.host);
  }, this);

};

/**
 *  Create a universe (a 512 member array of zeros)
 */

function _createUniverse() {
  return Array.apply(null, new Array(512)).map(Number.prototype.valueOf, 0);
};
