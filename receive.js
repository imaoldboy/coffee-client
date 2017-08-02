'use strict';

// Use a Readline parser

const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

// Use a `\r\n` as a line terminator
const parser = new parsers.Readline({
  delimiter: '\r\n'
});

const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 38400,
stopBits:2

});

port.pipe(parser);

port.on('open', () => console.log('Port open'));

parser.on('data', function(data){
	console.log(data);	
	port.write(data+'\r\n');
	port.flush();
});

