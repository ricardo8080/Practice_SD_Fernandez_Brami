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

client_master.publish(TOPICMASTERREQUEST, b'{sensor_id: ', sensor_id, ' worker: ""}')

while True:
  try:
    message = client_master.check_msg()
    print(message)

    if message is not None:
      msg_json = ujson.loads(message)
      print(msg_json)
      destination = msg_json.destination
      print(destination)
      WORKERID = msg_json.worker
      print(WORKERID)

      client_worker = connect_and_subscribe(TOPICWORKERIDRESPONSE)
      client_worker.publish(TOPICWORKERIDREQUEST, b'pasame la tarea pvto')

      #led.value(True)


  except OSError as e:
    restart_and_reconnect()