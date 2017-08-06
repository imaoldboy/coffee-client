'use strict';
var config = require('./src/config');
var tools = require('./src/tools');
var SerialPort = require("serialport");
var sleep = require('sleep');
var deviceList = tools.getDeviceList();

if(deviceList.length == 2){
	setInterval(getAuthority(),2000);
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
		if(tools.filterCmd(data, config.filterCmdArrayBooting) != true){
			data = data + '\r\n';
			port1.write(data);
			port1.flush();
		}
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
		if(tools.filterCmd(data, config.filterCmdArrayBooting) != true){
			data = data + '\r\n';
			port2.write(data);
			port2.flush();
		}
	});

}else{
	console.log('device list size is not 2, so begin to reboot after sleep 10 seconds.');
	sleep.sleep(10);
	//tools.reboot();
}

function getUpdateFile(){
	var filename = 'coffee-client.zip';
	tools.downloadFile(config.updateUrl, filename, function(){
	    console.log(filename+'下载完毕');
	});
}


function getAuthority(){
	var serialno = tools.getSerialNo();
	
}

