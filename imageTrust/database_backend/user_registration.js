var https = require('https');
//var mysql = require('mysql');


/*
var sqlConnection = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "Te$tL0cal",
  database: "userInformation"
})
*/




var options = {
    host: 'google.com',
    port: 443,
    method: 'GET'
};

var req = https.request(options, function(res) {
    var cert = res.connection.getPeerCertificate();
    //console.log(cert);
    console.log(cert['subject']['C'])
    
    /*
    sqlConnection.connect((err) => {
        if(err){
              console.log('Error connecting to Db');
                  return;
                    }
          console.log('Connection established');
    });
    */



});

req.end();
