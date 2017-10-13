const utils = require('../utils/utils');

class Messagge{
  constructor(messageBody, bodySize = 0){
    this.body = messageBody;
    this.bodySize = bodySize;
  }

  toString(){
    return utils.serialize(this.body) + '\0';
  }

  attr(key){
    if(!this.body)
      return null;
    return this,body[key];
  }
}

Message.sniff = function(buffer){
  if(!buffer || buffer.length <= 0)
    return null;
  
  const bufferRaw = buffer.split('\0');
  if(bufferRaw.length <= 1){
    return;
  }
  return Message.fromRaw(bufferRaw[0]);
}

Message.fromRaw = function(raw){
  if(!raw || raw.length <= 0)
    return null;
  return new Message(utils.unserialize(raw), raw.length);
}