'use strict';
var config = require('./src/config');
var tools = require('./src/tools');
var SerialPort = require("serialport");
var sleep = require('sleep');
var deviceList = tools.getDeviceList();
var readPort = null;
var writePort = null;
const Machine = require('./src/machineRestInterface');
var status = '0';
var id = '';
var heartbeat2Num = 0;

tools.getSerialNo();

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
		//if(tools.filterCmd(data, config.filterCmdArrayBooting) != true  && tools.filterReadCmd(data, config.filterReadCmdArray) != true){
			if(config.heartbeat.startsWith(data) && readPort ==null){
				console.log('port1 is read');
				readPort = port1;	
				writePort = port2;	
			}
			testMmachineIsError(data);
			testMachineIsOk(data);
			data = data + '\r\n';
			port1.write(data);
			port1.flush();
		}
	});


	parser2.on('data', function(data){
		if(tools.filterCmd(data, config.filterCmdArrayBooting) != true){
		//if(tools.filterCmd(data, config.filterCmdArrayBooting) != true  && tools.filterReadCmd(data, config.filterReadCmdArray) != true){
			if(config.heartbeat.startsWith(data) && readPort ==null){
				console.log('port1 is read');
				readPort = port1;	
				writePort = port2;	
			}
			testMmachineIsError(data);
			testMachineIsOk(data);
			data = data + '\r\n';
			port2.write(data);
			port2.flush();
		}
	});

}else{
	console.log('begin to reboot 10sec');
	sleep.sleep(10);
	tools.reboot();
}

function testMachineIsOk(line){
	if(status != '0' && heartbeat2Num<5 && tools.isReadCmd(line, config.heartbeat2)){
		heartbeat2Num++;
		console.log('got heartbeat2');
		if(heartbeat2Num ==5){
			tools.eventPipe.emit('machineIsOk');
			status = '0';
			heartbeat2Num = 0;
		}
	}
}

function testMmachineIsError(line){
	var cmdArray = config.cmdArrayError;
	if(status == '0'){
		for(var i=0;i<cmdArray.length;i++){
			if( tools.isReadCmd(line, cmdArray[i])){
				console.log('machine is error, send status to server');
				tools.eventPipe.emit('machineIsError');
				status = config.machine_status_bean_water;
				break;
			}
		}
	}
}

tools.eventPipe.on('serialNo', (serialNo)=>{
	console.log('got serialNo event.');
	setInterval(function(){
		Machine.getMachineById(serialNo, (data)=>{
			if(data[0] && data[0]['status']){
				id = data[0]['_id'];
				status = data[0]['status'];
				console.log(status);
				if(status == config.machine_status_paid){
					tools.eventPipe.emit('espresso');
					console.log('machine status is 1, got payment, emit espresso event');
					var cups = parseInt(data[0]['cups'], 10);
					cups = cups+1;
					console.log('id is:' + id);
					console.log('cups is:' + cups);
					var args = {
						data: { status:config.machine_status_busy, cups: ""+cups},
						headers: { "Content-Type": "application/json" }
					};
					console.log('begin to update machines status to 2.');
					Machine.updateMachine(id, args);
				}
			}
		});
	},2000);
});

tools.eventPipe.on('machineIsOk', ()=>{
	var args = {
		data: { status: config.machine_status_ok },
		headers: { "Content-Type": "application/json" }
	};
	console.log('machine is ok so set status=0 . id is: ' + id);
	Machine.updateMachine(id, args);

});

tools.eventPipe.on('machineIsError', ()=>{
	var args = {
		data: { status: config.machine_status_bean_water },
		headers: { "Content-Type": "application/json" }
	};
	console.log('machine is error so set status=3 . id is: ' + id);
	Machine.updateMachine(id, args);
	status = config.machine_status_bean_water;
});

tools.eventPipe.on('espresso', ()=>{
	writePort.write(config.espresso);
	writePort.flush();
	console.log('begin to make espresso.');
});

tools.eventPipe.on('reboot', (reason,sleepnum)=>{
	console.log('begin to reboot because of:' + reason + ", sleepnum is :" + sleepnum);
	if(sleepnum>0){
		sleep.sleep(sleepnum);
	}	
	//tools.reboot();
});



/*
function getUpdateFile(){
	var filename = 'coffee-client.zip';
	tools.downloadFile(config.updateUrl, filename, function(){
	    console.log(filename+'下载完毕');
	});
}

*/
