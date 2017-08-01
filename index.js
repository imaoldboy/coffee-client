var SerialPort = require("serialport");
var cmd_str = "0xB0C0A80101001A";
//var cmd_str = "0xB0C0A80101001A";
//var cmd_str = "B0C0A80101001A";
var buffer2 = Buffer.from("B0C0A80101001A", "hex")

var buffer = new Buffer(10);
buffer[0] = 0xB0;
buffer[1] = 0xC0;
buffer[2] = 0xA8;
buffer[3] = 0x01;
buffer[4] = 0x01;
buffer[5] = 0x00;
buffer[6] = 0x1A;

var port = new SerialPort("/dev/ttyUSB0",{
    bandrate:9600,
    autoOpen:false,
    stopBits:1,
timeOut:2
});

function hex(str) {
        var arr = [];
        for (var i = 0, l = str.length; i < l; i ++) {
                var ascii = str.charCodeAt(i);
                arr.push(ascii);
        }
        arr.push(255);
        arr.push(255);
        arr.push(255);
        return new Buffer(arr);
}

function writeCmd(){
	console.log('in writeCmd()');
/*
	port.write(buffer, function (err, result) {
            if (err) {
                console.log('Error while sending message : ' + err);
            }
            if (result) {
                console.log('Response received after sending message : ' + result);
            }    
        });
*/
	port.write(buffer2);
	//port.write(buffer2, 'hex');
	//port.write(hex(cmd_str));
	//port.write(cmd_str,'hex');
}

port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }

  // Because there's no callback to write, write errors will be emitted on the port:
 setInterval(writeCmd,2000);
 
});



// The open event is always emitted
port.on('open', function() {
	console.log('in open');
  // open logic
});

port.on('data', function (data) {
 console.log('Data:', data.toString('hex'));
});
