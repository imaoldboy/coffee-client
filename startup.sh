>/home/pi/coffee-client/index.log
/bin/chown pi:pi /home/pi/coffee-client/index.log
nohup node /home/pi/coffee-client/index.js > /home/pi/coffee-client/index.log 2>&1 &
