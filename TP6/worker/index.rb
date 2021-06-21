this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(File.dirname(this_dir), 'bin')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require 'multi_json'
require_relative './bin/helloworld_services_pb'
require 'mqtt'
require 'uri'
require 'socket'
require 'io/console'

include Helloworld

iter_freq = ''

id = Socket.gethostname


puts "funciona"
puts "#{id}"


stub = Helloworld::Greeter::Stub.new('master:9090', :this_channel_is_insecure)
iter_freq = stub.register(Helloworld::Request.new(message: '{"worker_id": "' + id + '"}')).message

# ServerImpl provides an implementation of the RouteGuide service.
class ServerImpl < Helloworld::Greeter::Service
  def send_task(point, _call)
    puts "#{point}"
    puts _"#{call}"
    json_m = JSON.parse(iter_freq)
    json_m["data"].push("worker_id" => id)
    puts "#{JSON.generate(json_m)}"
    #MQTT::Client.connect('research.upb.edu:11132') do |c|
    MQTT::Client.connect('research.upb.edu:11182') do |c|
      c.publish('upb/' + point.request.message + '/response', JSON.generate(json_m))
    end
  end
end

port = id + ':9090'
puts "hola"
s = GRPC::RpcServer.new
s.add_http2_port(port, :this_port_is_insecure)
GRPC.logger.info("... running insecurely on #{port}")
s.handle(ServerImpl)
s.run_till_terminated_or_interrupted([1, 'int', 'SIGQUIT'])

