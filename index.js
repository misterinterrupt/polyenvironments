var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var defaultPort = process.env.PORT || 80;

app.set('view engine', 'jade');
app.use(express.static('public'));

//parse post vars - from: http://stackoverflow.com/questions/5710358/how-to-get-post-a-query-in-express-js-node-js
app.use( bodyParser.json({
  extended: false,
  parameterLimit: 10000,
  limit: 1024 * 1024 * 10
}) );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false,
  parameterLimit: 10000,
  limit: 1024 * 1024 * 10
}));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.render('./compCreate.jade');
});


var server = app.listen(defaultPort, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("polyenvironments listening http://%s:%s", host, port);
});