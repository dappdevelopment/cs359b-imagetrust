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


app.post('/imagetrust/api/login', function(req, res) {

  var sql = "SELECT Password, FirstName, LastName, Company FROM userInfo WHERE UserName = ?";
  var value = [req.body.userName];
  var query = mysql.format(sql, value);

  sqlConn.query(query, function (err, rows, fields) {
    if (err) {
      res.status(400).send({
        message: 'Username is not found.'
      });
    }
    if (rows.length == 0) {
      console.log("no match");
      res.status(401).send();
    }
    
    console.log("got rows");
    rows.map((row) => {

      console.log(row);
      if (row.Password == req.body.passHash) {
        console.log("matched");
        res.status(200).send( {
            firstName : row.FirstName,
            lastName  : row.LastName,
            company   : row.Company
        });
      }
      else {
        console.log("no match");
        res.status(401).send();
      }
    })
  });
});

async function test(link) {
  var options = {
    host: req.body.keyLink, //'google.com',
    port: 443,
    method: 'GET'
  };

  console.log("options");
  console.log(options);
  var cert;
  var certOut = https.request(options, function(certReq) {
    console.log("here");
    cert = certReq.connection.getPeerCertificate()
    console.log(cert);
    //console.log(cert['subject']);
    //console.log(cert['subject']['O']);
  });

  certOut.end();
  return cert;
}


app.post('/imagetrust/api/checkKey', function(req, res) {

  var sql = "SELECT UserName FROM userInfo WHERE PublicKey = ?";
  var value = [req.body.key];
  var query = mysql.format(sql, value);

  sqlConn.query(query, function (err, rows, fields) {
    if (err) {
      res.status(400).send({
        message: 'public Key is not found.'
      });
    }
    if (rows.length == 0) {
      res.status(200).send();
    }
    else {
      res.status(401).send();
    } 
    return;
  });
});



app.post('/imagetrust/api/newUser', function(req, res) {

  var options = {
    host: req.body.keyLink, //'google.com',
    port: 443,
    method: 'GET',
    //rejectUnauthorized: true
    agent: new https.Agent({
        maxCachedSessions: 0
    })
  };

  var data = '';
  var certOut = https.request(options, function(rq) {
    rq.subject = rq.connection.getPeerCertificate().subject;
    rq.on('data', (d) => {
      data += d;
    });
    rq.on('end', () => {
      console.log('got results', rq.subject);
      var outp = {
        org : rq.subject.O,
        loc : rq.subject.L
      };
      console.log(outp);

      var sql = "INSERT INTO userInfo (UserName, FirstName, LastName, Company, Country, City, Password, KeyLink, PublicKey) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
      var values = [req.body.userName, req.body.firstName, 
      	      req.body.lastName, rq.subject.O,
      	      rq.subject.C, rq.subject.L,
      	      req.body.passHash, req.body.keyLink, 
      	      req.body.key];

      console.log(values);
      var sqlRes = sqlConn.query(sql, values, function (err, result) {
        if (err) {
          console.log("error");
          res.status(400).send({ 
      	    message: 'activity log failed, Error: ' + err });
        }
        console.log("Inserted at " + result.insertId);
        res.status(200).send({ company : rq.subject.O });
      });
    });
  });

  certOut.end();
});


app.post('/imagetrust/api/getUserInfo', function(req, res) {

  var sql = "SELECT FirstName, LastName, Company FROM userInfo WHERE PublicKey = ?";
  var value = [req.body.key];
  var query = mysql.format(sql, value);

  sqlConn.query(query, function (err, rows, fields) {
    if (err) {
      res.status(400).send({
        message: 'public Key is not found.'
      });
    }
    if (rows.length == 0) {
      console.log("no match");
      res.status(401).send();
    }
    
    res.status(200).send( {
        firstName : rows[0].FirstName,
        lastName  : rows[0].LastName,
        company   : rows[0].Company
    });
    return;
  });
});


app.post('/imagetrust/api/addLicense', function(req, res) {

  var sql = "INSERT INTO licenses (company, software, duration, price) VALUES (?, ?, ?, ?)";
  var values = [];

  if (req.body.DurationOption1 != "") {
    values = [req.body.company, req.body.productName,
              req.body.DurationOption1, req.body.PriceOption1];

    var sqlRes = sqlConn.query(sql, values, function (err, result) {
      if (err) {
        console.log("error");
        res.status(400).send({ 
    	    message: 'activity log failed, Error: ' + err });
      }
    });
  }
  if (req.body.DurationOption2 != "") {
    values = [req.body.company, req.body.productName,
              req.body.DurationOption2, req.body.PriceOption2];

    var sqlRes = sqlConn.query(sql, values, function (err, result) {
      if (err) {
        console.log("error");
        res.status(400).send({ 
    	    message: 'activity log failed, Error: ' + err });
      }
    });
  }
  if (req.body.DurationOption3 != "") {
    values = [req.body.company, req.body.productName,
              req.body.DurationOption3, req.body.PriceOption3];

    var sqlRes = sqlConn.query(sql, values, function (err, result) {
      if (err) {
        console.log("error");
        res.status(400).send({ 
    	    message: 'activity log failed, Error: ' + err });
      }
    });
  }
});


app.post('/imagetrust/api/getCompanies', function(req, res) {

  var sql = "SELECT company FROM userInfo";
  var query = mysql.format(sql);

  sqlConn.query(query, function (err, rows, fields) {
    if (err) {
      res.status(400).send({
        message: 'License is not found.'
      });
    }
    if (rows.length == 0) {
      console.log("License not found.");
      res.status(401).send();
    }
    
    console.log("got rows");
    console.log(rows);
    var i=0;
    var out = [];
    for (i=0; i<rows.length; i++) {
      console.log(rows[i].company);
      out.push(rows[i].company);
    }
    res.status(200).send({ companies : out});
  });
});


app.post('/imagetrust/api/getSoftware', function(req, res) {

  var sql = "SELECT software FROM licenses WHERE company = ?";
  var values = [req.body.company];
  var query = mysql.format(sql, values);

  sqlConn.query(query, function (err, rows, fields) {
    if (err) {
      res.status(400).send({
        message: 'License is not found.'
      });
    }
    if (rows.length == 0) {
      console.log("License not found.");
      res.status(401).send();
    }
    
    console.log("got Soft rows");
    console.log(rows);
    var i=0;
    var out = [];
    for (i=0; i<rows.length; i++) {
      console.log(rows[i].software);
      out.push(rows[i].software);
    }
    res.status(200).send({ software : out});
  });
});


app.post('/imagetrust/api/getPrices', function(req, res) {

  var sql = "SELECT duration, price FROM licenses WHERE company = ? AND software = ?";
  var values = [req.body.company, req.body.software];
  var query = mysql.format(sql, values);

  sqlConn.query(query, function (err, rows, fields) {
    if (err) {
      res.status(400).send({
        message: 'License is not found.'
      });
    }
    if (rows.length == 0) {
      console.log("License not found.");
      res.status(401).send();
    }
    
    console.log("got rows");
    console.log(rows);
    var i=0;
    var outDur = [];
    var outPrc = [];
    for (i=0; i<rows.length; i++) {
      console.log(rows[i].duration);
      outDur.push(rows[i].duration);
      outPrc.push(rows[i].price);
    }
    res.status(200).send({ 
          durations : outDur,
          prices    : outPrc
    });
  });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
