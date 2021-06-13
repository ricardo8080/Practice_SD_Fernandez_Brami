const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
//const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const id = os.hostname();

client.on('connect', function() {
    client.subscribe(process.env.TOPICMASTERREGISTER, function (err) {
        if (!err) {
            console.log('connected');
        }
    })
})

client.on('message', function (topic, message) {
    // message is Buffer
    if(topic == process.env.TOPICMASTERREGISTER) {
        console.log(message.toString());    
        const newItem = new Item({
            worker_id: req.body.name
        });
    }
    newItem.save();
  })

//Initialization
//const express = require('express');
const mongoose = require('mongoose');

//const app = express();
//Settings
// Connect to MongoDB
require('./database');
//app.use(express.urlencoded({ extended: false }));

const Item = require('./models/registry');

//app.set('Port', process.env.PORT || 1883);
/*
app.get('/', (req, res) => {
    console.log(Item.find());
});

app.post('/', (req, res) => {
    const newItem = new Item({
        worker_id: req.body.name
    });

    newItem.save();
});

app.listen(app.get('Port'), ()=>{
    console.log('Express server on port 1883');
});
*/

