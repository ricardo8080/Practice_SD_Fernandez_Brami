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

from machine import Pin, SoftI2C
from time import sleep

import ssd1306

import ujson

#ssid = '5G Tigo COVID-19'
#password = 'As96HBUn'
ssid = 'EnGenius7F67B2'
password = '*RF250570notta'

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
print(station.ifconfig())
print('la ip es: ', station.ifconfig()[0][-2:-1])

ip = station.ifconfig()[0][-2:0]
sub_ips = ip.split('.')

SENSORID = sub_ips[len(sub_ips) - 1] + '.' + sub_ips[len(sub_ips) - 2] + '.' + str(time.gmtime(0))

WORKERID = ''

master_request = {
  sensor_id: SENSORID,
  worker: WORKERID
}

worker_request = {
  sensor_id: SENSORID
}

SERVER='192.168.100.58'
PORT='1883'
TIMEOUT=5
TOPICMASTERREQUEST='upb/master/request'
TOPICMASTERRESPONSE='upb/master/response'
TOPICWORKERIDREQUEST='upb/', WORKERID, '/request'
TOPICWORKERIDRESPONSE='upb/', WORKERID, '/response'