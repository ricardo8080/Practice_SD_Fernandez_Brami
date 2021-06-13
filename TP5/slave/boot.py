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

from machine import Pin, SoftI2C
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
i = 0
for net in station.scan():
  if i == 7:
    oled.show()
    time.sleep(1)
    i = 0
    oled.fill(0)
  oled.text(net[0], 0, i * 14)
  i = i + 1
time.sleep(1)
station.connect(ssid, password)

while station.isconnected() == False:
  pass

print('Connection successful')
oled.fill(0)
oled.text('Connection', 0, 0)
oled.text('successful', 0, 14)
oled.show()
print(station.ifconfig())