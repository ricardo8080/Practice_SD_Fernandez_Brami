var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://test.mosquitto.org')
//var client  = mqtt.connect('mqtt://brokertp2')
//var client  = mqtt.connect('mqtt://'+process.env.IP + ':'+process.env.LISTEN)


function intervalFunc() {
    console.log('Cant stop me now!');
    client.publish('presence', 'Hello mqtt')
}

client.on('connect', function () {
//    client.publish('presence', 'Hello mqtt')
    setInterval(intervalFunc, 5000);
})
