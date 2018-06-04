var express = require('express');
var app = express();
// This should be done using a router (see: https://stackoverflow.com/questions/9439727/configuring-context-path-within-express-connect)
var contextPath = '/test';

app.get(contextPath + '/hello', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
