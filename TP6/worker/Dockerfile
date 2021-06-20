FROM ruby:latest

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

WORKDIR /usr/src/app

COPY Gemfile Gemfile.lock grpc.gemspec ./
RUN bundle install

COPY . .

#CMD ["grpc_tools_ruby_protoc -I ./ --ruby_out=./bin --grpc_out=./bin ./helloworld.proto"]

CMD ["./bin/index.rb"]