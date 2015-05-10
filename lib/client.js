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

  this.socket && this.socket.close(function(){
    this.socket = null;
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

  this.timer = setInterval(() => {
    this._send();
  }, this.interval);

  return this.timer;
};

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
  
  if (!this.data[universe]) this.data[universe] = [];

  if (!this.data[universe][channel]) this.data[universe][channel] = value;
};

/**
 *  Transmit the data
 */

Artnet.prototype._send = function _send() {

  var self = this;

  this.data.forEach(function(universe){
    universe.forEach(function(channel){
      // TODO: udp transmit 
    });
  });

  self = null;
};
