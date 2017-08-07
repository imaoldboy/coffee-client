'use strict';
var config = require('./src/config');
var tools = require('./src/tools');
var SerialPort = require("serialport");
var sleep = require('sleep');
var deviceList = tools.getDeviceList();
var readPort = null;
var writePort = null;
const Machine = require('./src/machineRestInterface');
tools.getSerialNo();
//var serialNo = '0000000031f46074';
//Machine.getMachineById(serialNo, console.log);
var status = '0';
tools.eventPipe.on('serialNo', (serialNo)=>{
	console.log('got serialNo event.');
	setInterval(function(){
		Machine.getMachineById(serialNo, (data)=>{
			status = data[0]['status'];
			console.log(status);
			if(status == '1'){
				tools.eventPipe.emit('espresso');
				console.log('machine status is 1, got payment, emit espresso event');
			}
		});
	},2000);
});

tools.eventPipe.on('espresso', ()=>{
	writePort.write(config.espresso);
	writePort.flush();
	console.log('begin to make espresso.');
});



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
	const parser2 = new parsers.Readline({
		delimiter: '\r\n'
	});
	const port2 = new SerialPort('/dev/'+deviceList[1], {
		baudRate: 38400,
		stopBits:2
	});
	port2.pipe(parser2);
	port2.on('open', () => console.log('Port2 open'));


	parser1.on('data', function(data){
		if(tools.filterCmd(data, config.filterCmdArrayBooting) != true){
			if(config.heartbeat.startsWith(data) && readPort ==null){
				console.log('port1 is read');
				readPort = port1;	
				writePort = port2;	
			}
			data = data + '\r\n';
			port1.write(data);
			port1.flush();
		}
	});



	parser2.on('data', function(data){
		if(tools.filterCmd(data, config.filterCmdArrayBooting) != true){
//			if(config.heartbeat2.startsWith(data) && !writePort){
//				writePort = port2;	
//				console.log('port2 is write');
//			}
			if(config.heartbeat.startsWith(data) && readPort ==null){
				console.log('port1 is read');
				readPort = port1;	
				writePort = port2;	
			}
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

function getMachineStatus(statusData){
	Machine.getMachineById(serialNo, console.log);
}

