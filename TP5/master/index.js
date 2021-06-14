const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
//const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const id = os.hostname();
const express = require('express');git 
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
            console.log('connected to ' + process.env.TOPICMASTERREGISTER);
        }
    })
})

client.on('message', async function (topic, message) {
    // message is Buffer
    switch(topic) {
        case process.env.TOPICMASTERREGISTER:
            const newItem = new Item({
                worker_id: (JSON.parse(message)).worker_id
            });
            await newItem.save();
            console.log(JSON.parse(message));
        break;
        case process.env.TOPICMASTERREQUEST:
            const destination = (JSON.parse(message)).sensor_id;
            const worker = (JSON.parse(message)).worker
            if (worker == '') {
                const Workers = await Item.findOne();
                if ( Workers === null || 
                    Workers === undefined  )
                {

                } else {
                    client.publish(process.env.TOPICMASTERRESPONSE, getId());
                }
            } else {
                const newItem = new Item({
                    worker_id: worker
                });
                await newItem.save();
                console.log(JSON.parse(message));
            }
            
        break;
        default:
            console.log("wrong topic");
    }
})
