const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
//const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const id = os.hostname();
const express = require('express');
const app = express()
const mongoose = require('mongoose');

// Connect to MongoDB
require('./database');

const Item = require('./models/registry');


const http = require("http");
const requestListener = function (req, res) {
    res.writeHead('ok');
    res.end('Ok again');
  }
const server = http.createServer(requestListener);
server.listen(8080);

client.on('connect', function() {
    client.subscribe(process.env.TOPICMASTERREGISTER, function (err) {
        if (!err) {
            console.log('connected');
        }
    })
})

client.on('message', async function (topic, message) {
    // message is Buffer
<<<<<<< HEAD
    console.log(topic + " test");    
=======
>>>>>>> dd3ac5185e276c8c0ab6b47ff216696b2c83ae4e
    if(topic == process.env.TOPICMASTERREGISTER) {
        const newItem = new Item({
            worker_id: (JSON.parse(message)).worker_id
        });
        await newItem.save();
        console.log(JSON.parse(message));    
    }
  })


