const event = require('events');
const Client = require('./net/client');

class Room extends event.EventEmitter{
  constructor(roomID){
    super();
    this.client = null;
    this.roomId = roomID;
  }

  open(){
    this.client = new Client();
    this.client.on('connect', this.onConnected);
    this.client.on('message', this.onMessage);
    this.client.connect();
  }

  onConnected(){
    
  }
}