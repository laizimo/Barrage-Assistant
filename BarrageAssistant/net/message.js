const utils = require('../utils/utils');

class Message{
  constructor(messageBody, bodySize = 0){
    this.body = messageBody;
    this.bodySize = bodySize;
  }

  toString(){
    return utils.serialize(this.body) + '\0';
  }

  getAttr(key){
    if(!this.body)
      return null;
    return this.body[key];
  }
}

Message.sniff = function(buffer){
  if(!buffer || buffer.length <= 0){
    return null;
  }
  const bodySize = buffer.split('\0');
  return Message.toRaw(bodySize[0]);
}

Message.toRaw = function(raw){
  if(!raw || raw.length <= 0)
    return null;
  return new Message(utils.unserialize(raw), raw.length);
}

module.exports = Message;
