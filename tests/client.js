'use strict';

var dgram = require('dgram');
var os = require('os');
var assert = require('assert');

var ip = os.networkInterfaces()['en0'][1].address;
var Client = require('../lib/client');

describe('a bad integration test', function(){
  it('will receive messages on port 6454', function(d){

    var client = new Client({
      host: ip
    }).connect();

    client.set(1, 20, 30);

    setInterval(function(){
      client.set(2, 20, random());
      client.set(2, 21, random());
      client.set(2, 22, random());
      client.set(2, 23, random());
      client.set(2, 24, random());
    }, 100);

    function random() {
      return Math.floor(Math.random() * 128);
    };

    var sucker = dgram.createSocket('udp4');

    sucker.bind(6454, function() {
      sucker.on('message', function(data){
        assert.ok(data);
        d();
      });
    });
  
  });
});
