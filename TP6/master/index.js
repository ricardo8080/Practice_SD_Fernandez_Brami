const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
const sleep = require('system-sleep');
const client_mqtt  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const id = os.hostname();
const express = require('express');
const app = express()
const mongoose = require('mongoose');

// Connect to MongoDB
require('./database');
const Item = require('./models/registry');

// Create gRPC server
const PROTO_PATH = './helloworld.proto';
const parseArgs = require('minimist');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

//Create Mini Server http
const http = require("http");
const requestListener = function (req, res) {
    res.writeHead('ok');
    res.end('Ok again');
}
const server = http.createServer(requestListener);
server.listen(8080);

async function getAndSaveWorkerToRegister(message){
    console.log(message)
    if (!(message === null ||  message === undefined)) {
        const newItem = new Item({
            worker_id: (JSON.parse(message)).worker_id
        });
        await newItem.save().then(() => console.log("worker_id saved successfully"));
    } else {
        console.log("No workerid was sent")
    }
}

async function makeSendTask(message) {
    const destination = (JSON.parse(message)).sensor_id;
    const worker = (JSON.parse(message)).worker;
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
    if (!(Workers === null || Workers === undefined)) {
        var argv = parseArgs(process.argv.slice(2), {
            string: 'target'
        });
        var target;
        if (argv.target) {
            target = argv.target;
        } else {
            target = Workers.worker_id + '9090';
        }
        var client_grpc = new hello_proto.Greeter(target, grpc.credentials.createInsecure());
        client_grpc.sendTask({message: destination}, function(err, response) {
            console.log('Greeting:', response.message);
        });
    }
}

async function register(call, callback) {
    console.log(call)
    console.log(call.request.message)
    await getAndSaveWorkerToRegister(call.request.message);
    const freq = parseFloat((Math.random() + 0.50).toFixed(2));
    const data = {
        freq: freq,
        iteration: (Math.floor(Math.random() * 15) + 5) 
    }
    callback(null, {message: JSON.stringify(data)});
}

client_mqtt.on('connect', function() {
    sleep(5000);
    client_mqtt.subscribe(process.env.TOPICMASTERREQUEST, function (err) {
        if (!err) {
            console.log('connected to ' + process.env.TOPICMASTERREQUEST);
        }
    })
})

client_mqtt.on('message', async function (topic, message) {
    console.log("received a message: " +  message + " : "  + topic);
    // message is Buffer
    if(topic == process.env.TOPICMASTERREQUEST) {
        makeSendTask(message);
    }
})

var server_grpc = new grpc.Server();
server_grpc.addService(hello_proto.Greeter.service, {register: register});
server_grpc.bindAsync(id + ':9090', grpc.ServerCredentials.createInsecure(), () => {
    server_grpc.start();
});

//server.addService(hello_proto.Greeter.service, {sendTask: sendTask});
//server.bindAsync('master:9090', grpc.ServerCredentials.createInsecure(), () => {
//server.bindAsync('master_1:9090', grpc.ServerCredentials.createInsecure(), () => {
