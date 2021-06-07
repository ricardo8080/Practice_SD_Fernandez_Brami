# Complete project details at https://RandomNerdTutorials.com

def sub_cb(topic, msg):
  print((topic, msg))
  if topic == b'notification' and msg == b'received':
    print('ESP received hello message')

def connect_and_subscribe():
  global client_id, mqtt_server, topic_sub
  print('hola')
  client = MQTTClient(client_id, mqtt_server)
  print('a')
  client.set_callback(sub_cb)
  print('b')
  client.connect()
  print('c')
  client.subscribe(topic_sub)
  print('Connected to %s MQTT broker, subscribed to %s topic' % (mqtt_server, topic_sub))
  return client

def restart_and_reconnect():
  print('Failed to connect to MQTT broker. Reconnecting...')
  time.sleep(10)
  machine.reset()

try:
  print('marco')
  client = connect_and_subscribe()
  print('polo')
except OSError as e:
  restart_and_reconnect()

while True:
  try:
    client.check_msg()
#    if (time.time() - last_message) > message_interval:
#      msg = b'Hello #%d' % counter
#      client.publish(topic_pub, msg)
#      last_message = time.time()
#      counter += 1
  except OSError as e:
    restart_and_reconnect()