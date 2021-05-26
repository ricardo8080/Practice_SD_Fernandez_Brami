var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://brokertp2:1883')


function intervalFunc() {
	console.log('Cant stop me now!');
	client.publish('presence', 'Hello mqtt')
  }

client.on('connect', function () {
	client.subscribe('presence', function (err) {
		if (!err) {
			client.publish('presence', 'Hello mqtt')
			setInterval(intervalFunc, 1500);
	  }
	})
  })
