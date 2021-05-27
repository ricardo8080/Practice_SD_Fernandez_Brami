var mqtt = require('mqtt')
//var client  = mqtt.connect('mqtt://test.mosquitto.org')
var client  = mqtt.connect('mqtt://brokertp2:1883')
//var client  = mqtt.connect('mqtt://'+process.env.BROKERNAME)

 
client.on('connect', function() {
    client.subscribe('presence', function (err) {
        if (!err) {
            console.log('matenme! no literalmente');
        }
    })
})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    //client.end()
  })
