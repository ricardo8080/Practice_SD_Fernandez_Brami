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

from machine import Pin
from time import sleep

from machine import Pin, I2C
import ssd1306

ssid = '5G Tigo COVID-19'
password = 'As96HBUn'
mqtt_server = 'research.upb.edu'
mqtt_port = '11132'
client_id = ubinascii.hexlify(machine.unique_id())
topic_sub = b'general'
topic_pub = b'general'

last_message = 0
message_interval = 5
counter = 0
last_recieved = 0

led = Pin(25, Pin.OUT)

station = network.WLAN(network.STA_IF)

station.active(True)
station.connect(ssid, password)

while station.isconnected() == False:
  pass

print('Connection successful')
print(station.ifconfig())

i2c = I2C(scl=Pin(22), sda=Pin(21))
oled_width = 128
oled_height = 64
print(':(:')
oled = ssd1306.SSD1306_I2C(oled_width, oled_height, i2c)
print(':(')