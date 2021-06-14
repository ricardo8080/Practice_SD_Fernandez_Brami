def connect_and_subscribe(TOPIC):
  global client_id, SERVER, PORT
  client = MQTTClient(client_id, SERVER, PORT)
  client.set_callback(TOPIC)
  client.connect()
  client.subscribe(TOPIC)
  print('Connected to %s , subscribed to %s' % (SERVER, TOPIC))
  return client

def restart_and_reconnect():
  print('Failed to connect to MQTT broker. Reconnecting...')
  time.sleep(5)
  machine.reset()

try:
  client_master = connect_and_subscribe(topicmasterresponse)
except OSError as e:
  restart_and_reconnect()


#Send solicitude to master for worker_id
client_master.publish(topicmasterrequest, ujson.dumps(master_request))
print(ujson.dumps(master_request))
print('start')
while True:
  try:
    #expect answer from master
    message_master = client_master.check_msg()
    if message_master is not None:
      print(message_master)
      #if received save the message
      master_json = ujson.loads(message_master)
      print(master_json)
      destination = master_json.destination
      print(destination)
      #if it is for me then
      if destination == sensorid:
        workerid = master_json.worker
        print(workerid)
        #if there was response with worker_id then contact with worker
        if workerid != '':
          topicworkeridrequest=(b'upb/', workerid, b'/request')
          topicworkeridresponse=(b'upb/', workerid, b'/response')
          #subscrbe to worker and request work
          client_worker = connect_and_subscribe(topicworkeridresponse)
          print(ujson.dumps(worker_request))
          client_worker.publish(topicworkeridrequest, ujson.dumps(worker_request))
          #wait for answer of worker
          message_worker = client_worker.check_msg()
          while message_worker is None:
            message_worker = client_worker.check_msg()
          #when received save and do the task
          worker_json = ujson.loads(message_worker)
          print(worker_json)
          freq = worker_json.freq
          print(freq)
          iteration = worker_json.iteration
          print(iteration)
    #send again the request to master
    client_master.publish(topicmasterrequest, ujson.dumps(master_request))
    workerid = b''
  except OSError as e:
    restart_and_reconnect()