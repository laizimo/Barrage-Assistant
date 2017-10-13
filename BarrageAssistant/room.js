const Client = require('./net/client');
const event = require('events');

class Room extends event.EventEmitter{
  constructor(roomId){
    super();
    this.client = null;
    this.roomId = roomId;

    this.onConnected = this.onConnected.bind(this);
    this.onError = this.onError.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  open(){
    this.client = new Client();
    this.client.on('connect', this.onConnected);
    this.client.on('message', this.onMessage);
    this.client.connect();
  }

  keepAlive(){
    this.client.send({
      type: 'keepalive',
      tick: Math.floor(Date.now() / 1000)
    });
  }

  onConnected(){

    this.client.send({
      type: 'loginreq',
      roomid: this.roomId
    });

    setInterval(() => {
      this.keepAlive();
    }, 4500);

    this.emit('connect');

    this.client.on('error', this.onError);
    this.client.on('close', this.onClose);
  }

  onError(err){
    console.log('This Client has error: ' + err.toString());
    this.emit('error', err);
  }

  onClose(had_error){
    if(had_error)
      console.log('This Client closed: ' + had_error);
    
    this.emit('close', had_error);
  }

  onMessage(message){
    const messageType = message.getAttr('type');
    if(messageType === 'loginres'){
      this.client.send({
        type: 'joingroup',
        rid: this.roomId,
        gid: -9999
      });
    }
    this.emit(messageType, message.body);
  }
}

module.exports = Room;
