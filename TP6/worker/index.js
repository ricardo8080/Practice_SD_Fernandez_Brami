const mqtt = require('mqtt');
const ip = require("ip");
const os = require("os");
const process = require('process');
const sleep = require('system-sleep');
const client_mqtt  = mqtt.connect('mqtt://'+ process.env.BROKERNAME+ ':'+ process.env.PORT );
const id = os.hostname();

const PROTO_PATH = './helloworld.proto';

const parseArgs = require('minimist');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
});
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

var iter_freq = ''

function getId() {
  const data = { worker_id: id }
  console.log("id");
  console.log(data);
  return JSON.stringify(data);
};

function sendTask(call, callback) {
  console.log(call.request.message);
  TOPICSENSORIDRESPONSE='upb/'+JSON.parse(call.request.message).sensor_id+'/response'
  client_mqtt.publish(TOPICSENSORIDRESPONSE, iter_freq);
  callback(null, {sensor_id: 'sensor_id'});
}

client_mqtt.on('connect', function () {
  sleep(8000);
  //Send worker_id to master
  console.log('Connected to broker mqtt')
});

var argv = parseArgs(process.argv.slice(2), {
  string: 'target'
});
var target;
if (argv.target) {
  target = argv.target;
} else {
  target = 'master:9090';
}
var client_grpc = new hello_proto.Greeter(target, grpc.credentials.createInsecure());
client_grpc.register({message: getId()}, function(err, response) {
  console.log('Greeting:', response.message);
  iter_freq = response.message;
});

var server_grpc = new grpc.Server();
server_grpc.addService(hello_proto.Greeter.service, {sendTask: sendTask});
server_grpc.bindAsync(id + ':9090', grpc.ServerCredentials.createInsecure(), () => {
  server_grpc.start();
});