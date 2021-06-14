def connect_and_subscribe():
  global client_id, SERVER, PORT, TOPICMASTERRESPONSE
  client = MQTTClient(client_id, SERVER, PORT)
  client.set_callback(TOPICMASTERRESPONSE)
  client.connect()
  client.subscribe(TOPICMASTERRESPONSE)
  print('Connected to %s MQTT broker, subscribed to %s topic' % (SERVER, TOPICMASTERRESPONSE))
  return client

def restart_and_reconnect():
  print('Failed to connect to MQTT broker. Reconnecting...')
  time.sleep(5)
  machine.reset()

try:
  client = connect_and_subscribe()
except OSError as e:
  restart_and_reconnect()

client.publish(TOPICMASTERREQUEST, b'{sensor_id: %d, worker: ""}' % client_id)

while True:
  try:
    message = client.check_msg()
    if message is not None:
      last_recieved = time.time()
      led.value(True)
      oled.fill(0)
      for i in range(len(message) / 14):
        oled.text(message[14 * i:14 * (i + 1)], 0, 9 * i)
      oled.show()
    if (time.time() - last_recieved) > 1:
      led.value(False)
      #oled.fill(0)
      oled.show()
  except OSError as e:
    restart_and_reconnect()