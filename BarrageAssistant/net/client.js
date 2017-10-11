const net = require('net');
const util = require('util');
const events = require('events');


class Client extends events.EventEmitter{
  constructor(){
    super();
    this.socket = null;
    this.rawBuffer = '';
    this.messageBuffer = '';
  }

  connect(){
    this.socket = new net.Socket();
    this.socket.setEncoding('hex');
  }
}