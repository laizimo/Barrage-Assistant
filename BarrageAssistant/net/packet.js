
class Packet {
  constructor(packetBody, frameLength){
    this.body = packetBody;
    this.frameLength = frameLength;
  }

  getPacketFrameSize(){
    return 2 * (this.frameLength + 4);
  }

  //嗅探
  
}

