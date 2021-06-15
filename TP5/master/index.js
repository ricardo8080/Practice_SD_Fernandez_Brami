const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
const sleep = require('system-sleep');
const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
//const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const id = os.hostname();
const express = require('express');
const app = express()
const mongoose = require('mongoose');

// Connect to MongoDB
require('./database');
const Item = require('./models/registry');

//Create Mini Server http
const http = require("http");
const requestListener = function (req, res) {
    res.writeHead('ok');
    res.end('Ok again');
  }
const server = http.createServer(requestListener);
server.listen(8080);

async function getAndSaveWorkerToRegister(message){
    if (!(message === null ||  message === undefined)) {
        const newItem = new Item({
            worker_id: (JSON.parse(message)).worker_id
        });
        await newItem.save().then(() => console.log("worker_id saved successfully"));
    } else {
        console.log("No workerid was sent")
    }
}

async function getEsp32RequestAndAnswer(message) {
    const destination = (JSON.parse(message)).sensor_id;
    const worker = (JSON.parse(message)).worker;
    console.log(process.env.TOPICMASTERREQUEST);
    console.log("a " + worker + " a");
    //save the workerid again
    if (worker != "") {
        console.log('de verdad entro aqui ' + worker)
        const newItem = new Item({
            worker_id: worker
        });
        newItem.worker_id = worker;
        await newItem.save().then(() => console.log("worker_id saved successfully"));
    }
    //Search workerid to send response
    const Workers = await Item.findOneAndDelete();
    console.log("Workers");
    console.log(Workers);
    const response = {
        destination: destination,
        worker: ""
    };
    if (!(Workers === null || Workers === undefined)) {
        response.destination = destination;
        response.worker = Workers.worker_id;
    }
    console.log("response");
    console.log(response);
    return JSON.stringify(response);
}



client.on('connect', function() {
    sleep(5000);
    client.subscribe(process.env.TOPICMASTERREGISTER, function (err) {
        if (!err) {
            console.log('connected to ' + process.env.TOPICMASTERREGISTER);
        }
    })
    client.subscribe(process.env.TOPICMASTERREQUEST, function (err) {
        if (!err) {
            console.log('connected to ' + process.env.TOPICMASTERREQUEST);
        }
    })
})


client.on('message', async function (topic, message) {

    console.log("received a message: " +  message + " : "  + topic);

    // message is Buffer
    switch(topic) {
        case process.env.TOPICMASTERREGISTER:
            await getAndSaveWorkerToRegister(message);
        break;
        case process.env.TOPICMASTERREQUEST:
            client.publish(process.env.TOPICMASTERRESPONSE, await getEsp32RequestAndAnswer(message));
            break;
        default:
            console.log("wrong topic");
    }
})

