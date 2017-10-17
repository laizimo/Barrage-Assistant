const net = require('net');
const util = require('util');
const events = require('events');
const Packet = require('./packet');
const Message = require('./message');

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
    this.onData = this.onData.bind(this);
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

  onData(data){
    if(!data)
      return;
    
    this.rawBuffer += data;

    while(true){
      let packet = null;

      try {
        packet = Packet.sniff(this.rawBuffer);
      } catch (error) {
        this.emit('error', error);
        this.socket.destroy();
        return;
      }

      if(!packet)
        break;
      
      let bufferFrameLength = packet.getPacketFrameSize();
      this.rawBuffer = this.rawBuffer.substr(bufferFrameLength);

      this.messageBuffer += packet.body;

      while(true){

        let message = Message.sniff(this.messageBuffer);
        if(!message)
          break;
        
        this.messageBuffer = this.messageBuffer.substr(message.bodySize + 1);

        this.emit('message', message);
      }
    }
  }

  send(message){
    this.socket.write(Packet.fromMessage(new Message(message)).toRaw());
  }
}

module.exports = Client;