Gem::Specification.new do |s|
    s.name          = 'grpc-tp6'
    s.version       = '1.0.0'
    s.authors       = ['R y B']
    s.homepage      = 'https://github.com/ricardo8080/TP_SD_Fernandez_Brami/tree/developP/TP6/worker'
    s.summary       = 'gRPC Ruby overview sample'
    s.description   = 'Simple mqtt worker'
  
    s.files         = `git ls-files -- ./*`.split("\n")
    s.executables   = `git ls-files -- ./*.rb`.split("\n").map do |f|
        File.basename(f)
    end
    s.require_paths = ['bin']
    s.platform      = Gem::Platform::RUBY
  
    s.add_dependency 'grpc', '~> 1.0'
    s.add_dependency 'multi_json', '~> 1.13.1'
    s.add_dependency 'logger', '~> 1.4.2'
    s.add_development_dependency 'bundler', '>= 1.9'
  end
