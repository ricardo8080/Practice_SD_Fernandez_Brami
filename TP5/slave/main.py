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
  client_master = connect_and_subscribe(TOPICMASTERRESPONSE)
except OSError as e:
  restart_and_reconnect()

client_master.publish(TOPICMASTERREQUEST, ujson.dumps(request))

while True:
  try:
    message_master = client_master.check_msg()
    print(message_master)

    if message_master is not None:
      msg_json = ujson.loads(message_master)
      print(msg_json)
      destination = msg_json.destination
      print(destination)
      if destination == SENSORID:
        WORKERID = msg_json.worker
        print(WORKERID)
      if worker != '':
        restart_and_reconnect()
      client_worker = connect_and_subscribe(TOPICWORKERIDRESPONSE)
      client_worker.publish(TOPICWORKERIDREQUEST, b'{sensor_id: ', SENSORID, '}')

      message_worker = client_worker.check_msg()
      while message_worker is None:
        message_worker = client_worker.check_msg()
      
      #led.value(True)
      WORKERID = ''


  except OSError as e:
    restart_and_reconnect()