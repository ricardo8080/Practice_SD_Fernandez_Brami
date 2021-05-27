var mqtt = require('mqtt')
//var client  = mqtt.connect('mqtt://test.mosquitto.org')
var client  = mqtt.connect('mqtt://10.1.2.118:7777')
//var client  = mqtt.connect('mqtt://'+process.env.BROKERNAME)

 
client.on('connect', function() {
    client.subscribe('presence', function (err) {
        if (!err) {
            console.log('connected');
        }
    })
})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    //client.end()
  })
