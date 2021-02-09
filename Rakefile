desc "Pings PING_URL to keep a dyno alive"
task :dyno_ping do
  require "net/http"
  if ENV['PING_URL']
    uri = URI("https://futures-scrap.herokuapp.com/")
    Net::HTTP.get_response(uri)
  end
end
