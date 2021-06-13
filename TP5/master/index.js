const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
//const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const id = os.hostname();
const mongoose = require('mongoose');

// Connect to MongoDB
require('./database');

const Item = require('./models/registry');

client.on('connect', function() {
    client.subscribe(process.env.TOPICMASTERREGISTER, function (err) {
        if (!err) {
            console.log('connected');
        }
    })
})

client.on('message', function (topic, message) {
    // message is Buffer
        console.log(topic + "test");    
    if(topic == process.env.TOPICMASTERREGISTER) {
        console.log(message.toString());    
        const newItem = new Item({
            worker_id: (JSON.parse(message)).worker_id
        });
        newItem.save();
    }
  })


