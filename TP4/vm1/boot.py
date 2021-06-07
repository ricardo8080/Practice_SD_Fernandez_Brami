# Complete project details at https://RandomNerdTutorials.com

import time
from umqttsimple import MQTTClient
import ubinascii
import machine
import micropython
import network
import esp
esp.osdebug(None)
import gc
gc.collect()

ssid = '5G Tigo COVID-19'
password = 'As96HBUn'
mqtt_server = 'research.upb.edu' 
client_id = ubinascii.hexlify(machine.unique_id())
topic_sub = b'general'
topic_pub = b'general'

last_message = 0
message_interval = 5
counter = 0

station = network.WLAN(network.STA_IF)

station.active(True)
station.connect(ssid, password)

while station.isconnected() == False:
  pass

print('Connection successful')
print(station.ifconfig())