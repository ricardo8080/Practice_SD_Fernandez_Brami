this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(File.dirname(this_dir), 'bin')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require 'multi_json'
require_relative './bin/helloworld_services_pb'
require 'mqtt'
require 'uri'
require 'socket'

include Helloworld

iter_freq = ''

id = Socket.gethostname
ip = Socket.ip_address_list.find { |ai| ai.ipv4? && !ai.ipv4_loopback? }.ip_address

stub = Helloworld::Greeter::Stub.new('master:9090', :this_channel_is_insecure)
iter_freq = stub.register(Helloworld::Request.new(message: id)).message

# ServerImpl provides an implementation of the RouteGuide service.
class ServerImpl < Helloworld::Greeter::Service
  def send_task(point, _call)
    puts point
    puts _call
    #name = @feature_db[{
    #  'longitude' => point.longitude,
    #  'latitude' => point.latitude }] || ''
    #Feature.new(location: point, name: name)

    #MQTT::Client.connect('research.upb.edu:11132') do |c|
    MQTT::Client.connect('research.upb.edu:11182') do |c|
      c.publish('upb/' + point.request.message + '/response', iter_freq)
    end
  end
end

port = id + ':9090'
s = GRPC::RpcServer.new
s.add_http2_port(port, :this_port_is_insecure)
GRPC.logger.info("... running insecurely on #{port}")
s.handle(ServerImpl)
s.run_till_terminated_or_interrupted([1, 'int', 'SIGQUIT'])

