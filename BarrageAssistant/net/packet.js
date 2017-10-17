
class Packet{
  constructor(packetBody, frameLength = 0){
    this.body = packetBody;
    this.frameLength = frameLength;
  }

  toRaw(){
    if(!this.body || this.body.length <= 0)
      return null;
    const bufferHeader = new Buffer(Packet.frameHeaderLength+Packet.headerLength);
    const bufferBody = new Buffer(this.body, 'utf8');
    const totalLength = bufferBody.length + Packet.frameHeaderLength + Packet.headerLength;
    bufferHeader.writeInt32LE(totalLength - Packet.frameHeaderLength, 0);
    bufferHeader.writeInt32LE(totalLength - Packet.frameHeaderLength, 4);
    bufferHeader.writeInt16LE(689, 8);
    bufferHeader.writeInt16LE(0, 10);
    return Buffer.concat([bufferHeader, bufferBody], totalLength);
  }

  getPacketFrameSize(){
    return 2 * (this.frameLength + 4);
  }
}

Packet.frameHeaderLength = 4;
Packet.headerLength = 8;

Packet.sniff = function(bufferHex){
  const bufferAvailable = bufferHex.length / 2;
  if(bufferAvailable <= Packet.frameHeaderLength + Packet.headerLength ){
    return null;
  }
  const buffer = Buffer.from(bufferHex, 'hex');
  const packetLength = buffer.readInt32LE(0);
  const packetLength1 = buffer.readInt32LE(Packet.frameHeaderLength);
  const packetType = buffer.readInt16LE(Packet.frameHeaderLength * 2);
  const enctype = buffer.readInt8(Packet.frameHeaderLength * 2 + 2);
  const reserve = buffer.readInt8(Packet.frameHeaderLength * 2 + 3);
  let body = buffer.toString('utf8', Packet.frameHeaderLength + Packet.headerLength);

  if(packetLength <= 0 || packetLength1 <= 0){
    throw new Error('packet not vaild');
    return null;
  }
  
  if(packetLength != packetLength1){
    throw new Error('packet length not equal');
    return null;
  }

  if(bufferAvailable >= packetLength + 4){
    if(bufferAvailable > packetLength + 4){
      body = buffer.toString('utf8', Packet.frameHeaderLength + Packet.headerLength, packetLength + 4);
    }

    return new Packet(body, packetLength);
  }
  
  return null;
}

Packet.fromMessage = function(message){
  return new Packet(message.toString());
}

module.exports = Packet;
