def sub_cb(topic, msg):
  print((topic, msg))
  if topic == b'notification' and msg == b'received':
    print('ESP received hello message')

def connect_and_subscribe():
  global client_id, mqtt_server, mqtt_port, topic_sub
  client = MQTTClient(client_id, mqtt_server, mqtt_port)
  client.set_callback(sub_cb)
  client.connect()
  client.subscribe(topic_sub)
  print('Connected to %s MQTT broker, subscribed to %s topic' % (mqtt_server, topic_sub))
  return client

def restart_and_reconnect():
  print('Failed to connect to MQTT broker. Reconnecting...')
  time.sleep(5)
  machine.reset()

try:
  client = connect_and_subscribe()
except OSError as e:
  restart_and_reconnect()

while True:
  try:
    message = client.check_msg()
    if message is not None:
      print('LED ON')
      last_recieved = time.time()
      led.value(True)
      print(':)')
      oled.text('socialismo', 0, 0)
      [print('>:v')]
      oled.show()
    if (time.time() - last_recieved) > 1:
      led.value(False)
#    if (time.time() - last_message) > message_interval:
#      msg = b'Hello #%d' % counter
#      client.publish(topic_pub, msg)
#      last_message = time.time()
#      counter += 1
  except OSError as e:
    restart_and_reconnect()