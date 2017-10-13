const Room = require('../BarrageAssistant/room');

const roomID = "424559";

const room = new Room(roomID);

room.on('connect', () => {
  console.log('Welcome to douyu room: ' + roomID);
});

room.on('error', (err) => {
  console.log('This have some error' + err.toString());
});

room.on('close', (had_error) => {
  console.log('There is a ' + had_error);
});

room.on('chatmsg', function(message){
	console.log(`[${message.nn}]:${message.txt}`);
});

room.open();