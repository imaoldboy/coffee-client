'use strict';
var config = require('./src/config');
var tools = require('./src/tools');
var SerialPort = require("serialport");
//get serial device list
var deviceList = tools.getDeviceList();
console.log(deviceList);

if(deviceList.length == 2){
	const parsers = SerialPort.parsers;

	const parser1 = new parsers.Readline({
		delimiter: '\r\n'
	});
	const port1 = new SerialPort('/dev/'+deviceList[0], {
		baudRate: 38400,
		stopBits:2
	});
	port1.pipe(parser1);
	port1.on('open', () => console.log('Port1 open'));
	parser1.on('data', function(data){
		console.log(data);	
		port1.write(data+'\r\n');
		port1.flush();
	});


	const parser2 = new parsers.Readline({
		delimiter: '\r\n'
	});
	const port2 = new SerialPort('/dev/'+deviceList[1], {
		baudRate: 38400,
		stopBits:2
	});
	port2.pipe(parser2);
	port2.on('open', () => console.log('Port2 open'));
	parser2.on('data', function(data){
		console.log(data);	
		port2.write(data+'\r\n');
		port2.flush();
	});

}else{
	console.log('device list size is not 2.');
	tools.reboot();
}

var filename = 'coffee-client.zip';
tools.downloadFile(config.updateUrl, filename, function(){
    console.log(filename+'下载完毕');
});
