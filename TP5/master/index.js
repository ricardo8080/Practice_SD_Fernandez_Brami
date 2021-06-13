const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
//const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const client  = mqtt.connect('mqtt://'+ process.env.BROKERNAME);
const id = os.hostname();

/////////

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://mongo:27017/mydb";

const mongoclient = new MongoClient(uri, { useNewUrlParser: true });
mongoclient.connect((err) => {
    console.log('mongo connected');
    mongoclient.close();
});

///////

client.on('connect', function() {
    client.subscribe(process.env.TOPICMASTERREGISTER, function (err) {
        if (!err) {
            console.log('connected');
        }
    })
})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    /*
    if(topic == process.env.TOPICMASTERREGISTER) {
        console.log(message.toString());    
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var myobj = { worker_id: message };
            dbo.collection("workers").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              db.close();
            });
          });
        /*
        const newItem = new Item({
            worker_id: req.body.name
        });
        */
    //}
    
    //newItem.save();
})

function intervalFunc() {
    mongoclient.connect((err) => {
        console.log('mongo connected');
        mongoclient.close();
    });
    console.log('hola');
};

setInterval(intervalFunc, 5000);


//Initialization
//const express = require('express');
//const mongoose = require('mongoose');
//const mongoose = require('./database.js');



//const app = express();
//Settings
// Connect to MongoDB
//require('./database.js');
//app.use(express.urlencoded({ extended: false }));

//const Item = require('./models/registry');

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

