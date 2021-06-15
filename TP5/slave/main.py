def sub_cb_master(topic, msg):
  if topic == topicmasterresponse:
    return msg
  return None

def sub_cb_worker(topic, msg):
  if topic == topicsensoridresponse:
    return msg
  return None

def connect_and_subscribe(topic, sub_cb):
  global client_id, SERVER, PORT
  client = MQTTClient(client_id, SERVER, PORT)
  client.set_callback(sub_cb)
  client.connect()
  client.subscribe(topic)
  print('Connected to %s , subscribed to %s' % (SERVER, topic))
  return client

def restart_and_reconnect():
  print('Failed to connect to MQTT broker. Reconnecting...')
  time.sleep(5)
  machine.reset()

try:
  client = connect_and_subscribe(topicmasterresponse, sub_cb_master)
except OSError as e:
  restart_and_reconnect()


last_sent = time.time()
print(ujson.dumps(master_request))
print('start')
while True:
  try:
    #send firsttime/again the request to master
    if (time.time() - last_recieved) > message_interval:
      client.publish(topicmasterrequest, ujson.dumps(master_request))
      workerid = b''
      last_recieved = time.time()
    #expect answer from master
    message_master = client.check_msg()
    if message_master is not None:
      #print(message_master)
      #if received save the message
      master_json = ujson.loads(message_master)
      destination = master_json["destination"]
      #if it is for me then
      if destination == sensorid:
        workerid = master_json["worker"]
        #if there was response with worker_id then contact with worker
        if workerid != '':
          topicworkeridrequest=b'upb/' + workerid + b'/request'
          topicsensoridresponse=b'upb/' + sensorid + b'/response'
          #subscrbe to worker and request work
          client = connect_and_subscribe(topicsensoridresponse, sub_cb_worker)
          print(ujson.dumps(worker_request))
          client.publish(topicworkeridrequest, ujson.dumps(worker_request))       
          #wait for answer of worker
          message_worker = client.check_msg()
          while message_worker is None:
            message_worker = client.check_msg()
          #when received save and do the task
          worker_json = ujson.loads(message_worker)
          print(worker_json)
          freq = worker_json["freq"]
          iteration = worker_json["iteration"]
  except OSError as e:
    restart_and_reconnect()