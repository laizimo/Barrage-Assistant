
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
}

Packet.frameHeaderLength = 4;
Packet.headerLength = 8;

Packet.sniff = function(bufferHex){
  const buffer = Buffer.from(bufferHex, 'hex');
  const packetLength = buffer.readInt32LE(0);
  const packetLength1 = buffer.readInt32LE(Packet.frameHeaderLength);
  const packetType = buffer.readInt16LE(Packet.frameHeaderLength * 2);
  const enctype = buffer.readInt8(Packet.frameHeaderLength * 2 + 2);
  const reserve = buffer.readInt8(Packet.frameHeaderLength * 2 + 3);
  const body = buffer.toString('utf8', Packet.frameHeaderLength + Packet.headerLength);
  return new Packet(body, packetLength);
}

Packet.fromMessage = function(message){
  return new Packet(message.toString());
}

module.exports = Packet;
