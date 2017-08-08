var config = {
	restUrl: "http://101.200.80.132:3000/api/",
	serialBandrate : 38400,
	serialStopBits : 2,
	serialTimeOut : 2,
	logFile : "false",
	updateUrl : "http://www.usertech.cn/app/uploads/2016/coffee-client.tgz",
	filterCmd : "True",
	machine_status_ok : '0',
	machine_status_paid : '1',
	machine_status_busy : '2',
	machine_status_bean_water : '3',
	machine_status_alert : '4',
	machine_status_other : '5',
	machine_status_ok_timeout : '6',
	machine_status_paid_timeout : '7',
	machine_status_busy_timeout : '8',
	machine_status_bean_water_timeout : '9',
	machine_status_alert_timeout : '10',
	machine_status_other_timeout : '11',
	machine_status_need_restart  : '20',
	
	filterCmdArray : [":010600010508EB\r\n",":010600010005F3\r\n",":010600010006F2\r\n",":010600010007F1\r\n",":010600010509EA\r\n",":010600010409EB\r\n"],
	cmdArrayError : [":0104000123500000000200",":0104000310000000000400",":0104000313000000000200",":0104000313000000000100"],
	filterCmdArrayBooting : [":010600010508EB\r\n",":010600010005F3\r\n",":010600010006F2\r\n",":010600010007F1\r\n"],

	//#message from HMI-->MainBoard
	sys_error        : "00000BF0\r\n",
	shutdown         : ":010600010004F4\r\n",
	clean            : ":010600010508EB\r\n",
	longcoffee       : ":010600010002F6\r\n",
	cappuccino       : ":010600010005F3\r\n",
	coffeelatte      : ":010600010006F2\r\n",
	milkcream        : ":010600010007F1\r\n",
	turnleft         : ":010600010509EA\r\n",
	turnright        : ":010600010409EB\r\n",

	heartbeat        : ":01040000000BF0\r\n",
	espresso         : ":010600010001F7\r\n",
	hotwater         : ":010600010003F5\r\n",
	hotwater_confirm : ":01060001000AEE\r\n",


	//#message from MainBoard-->HMI
	heartbeat2       : ":0104000213000000000000",
	EmptyDripTray    : ":0104000313000000000100",
	OutOfWaterBox    : ":0104000313000000000200",
	OutOfWater       : ":0104000123500000000200",
	OutOfBean        : ":0104000310000000000400",
	FullOfWasteWater : ":0104000313000000000400",
	FullOfDrogs      : ":0104040310000000001100",
	coffeeConfirm    : ":0104052021110000000000",
	CoffeeReady      : ""



};
module.exports = config;
