import time
from umqttsimple import MQTTClient
from ntptime import settime
import ubinascii
import machine
import network
import esp
esp.osdebug(None)
import gc
gc.collect()

from machine import Pin, SoftI2C
from time import sleep

import ssd1306

import ujson

from ntptime import settime

ssid = '5G Tigo COVID-19'
password = 'As96HBUn'
#ssid = 'EnGenius7F67B2'
#password = '*RF250570notta'

client_id = ubinascii.hexlify(machine.unique_id())

led = Pin(25, Pin.OUT)

i2c_rst = Pin(16, Pin.OUT)
i2c_rst.value(0)
time.sleep_ms(5)
i2c_rst.value(1)
i2c_scl = Pin(15, Pin.OUT, Pin.PULL_UP)
i2c_sda = Pin(4, Pin.OUT, Pin.PULL_UP)
i2c = SoftI2C(scl=i2c_scl, sda=i2c_sda)
oled_width = 128
oled_height = 64
oled = ssd1306.SSD1306_I2C(oled_width, oled_height, i2c)

station = network.WLAN(network.STA_IF)
station.active(True)
station.connect(ssid, password)

while station.isconnected() == False:
  pass

print('Connection successful')
#print(station.ifconfig())
print('la ip es: ', station.ifconfig()[0])

settime()

ip = station.ifconfig()[0]
sub_ips = ip.split('.')

timestamp=str((946684800 + time.time()))
sensorid = sub_ips[len(sub_ips) - 2] + '.' + sub_ips[len(sub_ips) - 1] + '.' +  timestamp[-5:]
print(sensorid + ' :SENSORID')

message_interval = 5
last_recieved = 0

workerid = b''
master_request = {
  "sensor_id": sensorid,
  "worker": workerid
}

worker_request = {
  "sensor_id": sensorid
}

SERVER='research.upb.edu'
PORT='11132'
TIMEOUT=5
topicmasterrequest=b'upb/master/request'
topicmasterresponse=b'upb/master/response'
