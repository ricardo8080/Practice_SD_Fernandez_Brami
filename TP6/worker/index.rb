this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(File.dirname(this_dir), 'bin')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require 'multi_json'
require_relative './bin/helloworld_services_pb'
require 'mqtt'
require 'uri'
require 'socket'
require 'logger'

include Helloworld

iter_freq = ''

id = Socket.gethostname

logger = Logger.new('/proc/1/fd/1')
logger.level = Logger::DEBUG

stub = Helloworld::Greeter::Stub.new('master:9090', :this_channel_is_insecure)
iter_freq = stub.register(Helloworld::Request.new(message: '{"worker_id": "' + id + '"}')).message
logger.info("#{iter_freq}")

# ServerImpl provides an implementation of the RouteGuide service.
class ServerG < Helloworld::Greeter::Service
  def send_task(sendtaskr, _call)
    logger.info("llega aqui")
    logger.warn("#{sendtaskr}")
    logger.info("#{sendtaskr.message}")
    logger.error("#{_call}")
    json_m = JSON.parse(iter_freq)
    json_m["data"].push("worker_id" => id)
    logger.fatal("#{JSON.generate(json_m)}")
    #MQTT::Client.connect('research.upb.edu:11132') do |c|
    MQTT::Client.connect('research.upb.edu:11182') do |c|
      c.publish('upb/' + sendtaskr.message + '/response', JSON.generate(json_m))
    end
    Helloworld::Empty.new()
  end
end

port = id + ':9090'
logger.info("#{port}")
s = GRPC::RpcServer.new
logger.info("server created")
s.add_http2_port(port, :this_port_is_insecure)
logger.info("server added port")
s.handle(ServerG)
logger.info("service added")
s.run_till_terminated_or_interrupted([1, 'int', 'SIGQUIT'])
logger.info("mmmmmm")
