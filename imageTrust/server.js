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


app.post('/api/login', function(req, res) {

  var sql = "SELECT Password FROM userInfoTable2 WHERE UserName = ?";
  var value = [req.body.userName];
  var query = mysql.format(sql, value);

  sqlConn.query(query, function (err, rows, fields) {
    if (err) {
      res.status(400).send({
        message: 'Username is not found.'
      });
    }
    
    console.log("got rows");
    res.status(
      rows.map((row) => {
        console.log(row);
        if (row.Password == req.body.passHash) {
          console.log("matched");
          return 200;
        }
        else {
          console.log("no match");
          return 401;
        }
      })
    ).send();
  });
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
