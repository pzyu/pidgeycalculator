var express = require('express');
var packageInfo = require('./package.json');

var app = express();
var port = process.env.PORT || 0.0.0.0;

//app.set('port', (process.env.PORT || 0.0.0.0));
//app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.json({ version: packageInfo.version });
});

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Web server started at http://%s:%s', host, port);
});