Gem::Specification.new do |s|
    s.name          = 'grpc-tp6'
    s.version       = '1.0.0'
    s.authors       = ['R y B']
    s.summary       = 'gRPC Ruby overview sample'
    s.description   = 'Simple mqtt worker'
  
    s.require_paths = ['lib']
    s.platform      = Gem::Platform::RUBY
  
    s.add_dependency 'grpc', '~> 1.0'
    s.add_dependency 'multi_json', '~> 1.13.1'
    s.add_development_dependency 'bundler', '>= 1.9'
  end