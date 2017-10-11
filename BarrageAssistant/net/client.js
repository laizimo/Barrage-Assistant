const net = require('net');
const util = require('util');
const events = require('events');

const host = 'openbarrage.douyutv.com';
const port = 8601;

class Client extends events.EventEmitter{
  constructor(){
    super();
    this.socket = null;
    this.rawBuffer = '';
    this.messageBuffer = '';

    this.onConnected = this.onConnected.bind(this);
    this.onError = this.onError.bind(this);
    this.onClosed = this.onClosed.bind(this);
  }

  connect(){
    this.socket = new net.Socket();
    this.socket.setEncoding('hex');
    this.socket.connect(port, host, this.onConnected);
  }

  onConnected(){
    this.socket.on('data', this.onData);
    this.socket.on('error', this.onError);
    this.socket.on('close', this.onClosed);
    this.emit('connect');
  }

  onError(err){
    this.emit('error', err);
  }

  onClosed(had_error){
    this.emit('close', had_error);
  }

  onData(){
    // this function to 
    
  }
}