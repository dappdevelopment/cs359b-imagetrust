var express = require('express');
var mysql = require('mysql');
var https = require('https');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var protocol = process.env.HTTPS === 'true' ? "https" : "http";
var host = process.env.HOST || 'localhost';

var sqlConfig = require('./config/sql.js');
var sqlConn   = mysql.createConnection(sqlConfig.cred);

// This should be done using a router (see: https://stackoverflow.com/questions/9439727/configuring-context-path-within-express-connect)
var contextPath = '/test';

app.use(express.static('public'));

app.get(contextPath + '/hello', function (req, res) {
  res.send('Hello World!');
});

app.post(contextPath + '/opjs', function (req, res) {
  console.log("inside");
  console.log(req.body.msg);
  res.send(req.body.msg);
});

app.get(contextPath + '/:id', function (req, res) {
  var id = req.params.id;
  res.status(200).send(id);
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
