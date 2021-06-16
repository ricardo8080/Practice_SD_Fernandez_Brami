def sub_cb(topic, msg):
  if topic == topicmasterresponse or topic == topicsensoridresponse:
    return [topic, msg]
  return None

def connect_and_subscribe(topic):
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
  client = connect_and_subscribe(topicmasterresponse)
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
      master_request["worker"] = b''
      last_recieved = time.time()
    #expect answer from master
    message_master = client.check_msg()
    if message_master is not None and message_master[0] == topicmasterresponse:
      #if received save the message
      master_json = ujson.loads(message_master[1])
      destination = master_json["destination"]
      #if it is for me then
      if destination == sensorid:
        workerid = master_json["worker"]
        master_request["worker"] = workerid
        #if there was response with workerid then contact with worker
        if workerid != '':
          topicworkeridrequest=b'upb/' + workerid + b'/request'
          topicsensoridresponse=b'upb/' + sensorid + b'/response'
          #subscrbe to worker and request work
          client.subscribe(topicsensoridresponse)
          #print(ujson.dumps(worker_request))
          client.publish(topicworkeridrequest, ujson.dumps(worker_request))       
          #wait for answer of worker
          message_worker = client.check_msg()
          while message_worker is None or message_worker[0] != topicsensoridresponse:
            message_worker = client.check_msg()
          #when received save and do the task
          worker_json = ujson.loads(message_worker[1])
          print(worker_json)
          freq = worker_json["freq"]
          iteration = worker_json["iteration"]
          oled.fill(0)
          oled.text('workerid:', 0, 0)
          oled.text(workerid, 0, 9)
          oled.text('freq:', 0, 18)
          oled.text(str(freq), 0, 27)
          oled.text('iter:', 0, 36)
          oled.text(str(iteration), 0, 45)
          oled.show()
          for i in range(iteration):
            led.value(True)
            sleep(0.1)
            led.value(False)
            sleep(freq)
  except OSError as e:
    restart_and_reconnect()