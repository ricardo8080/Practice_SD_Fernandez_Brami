this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(File.dirname(this_dir), 'bin')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require 'multi_json'
require 'json'
require_relative './bin/helloworld_services_pb'
require 'mqtt'
require 'uri'
require 'socket'
require 'logger'
require 'resolv-replace'

include Helloworld

iter_freq = ''

id = Socket.gethostname

logger = Logger.new('/proc/1/fd/1')
logger.level = Logger::DEBUG

stub = Helloworld::Greeter::Stub.new('master:9090', :this_channel_is_insecure)
iter_freq = stub.register(Helloworld::Request.new(message: '{"worker_id": "' + id + '"}')).message
logger.info("#{iter_freq}")

# ServerImpl provides an implementation of the RouteGuide service.
class GreeterServer < Helloworld::Greeter::Service
  def initialize(iter_freq, id)
    @freq_iter = iter_freq
    @id = id
  end  

  def send_task(sendtaskr, _call)
    logger2 = Logger.new('/proc/1/fd/1')
    logger2.level = Logger::DEBUG
    json_m = JSON.parse(@freq_iter)
    json_m[:worker_id] = @id
    logger2.info("#{JSON.generate(json_m)}")
    #MQTT::Client.connect('research.upb.edu:11132') do |c|
    topicsensoridresponse = 'upb/' + sendtaskr.message + '/response'
    logger2.info("connecting to: #{topicsensoridresponse}")
    MQTT::Client.connect('mqtt://research.upb.edu:11182') do |c|
      c.publish(topicsensoridresponse, JSON.generate(json_m))
      logger2.info("task sent")
    end
    Helloworld::Empty.new(message: "ok")
  end
end

port = id + ':9090'
logger.info("connecting to: #{port}")
s = GRPC::RpcServer.new
logger.info("server created")
s.add_http2_port(port, :this_port_is_insecure)
logger.info("server added to: #{port}")
s.handle(GreeterServer.new(iter_freq, id))
logger.info("service handled")
s.run_till_terminated_or_interrupted([1, 'int', 'SIGQUIT'])
logger.info("Still running Services")
