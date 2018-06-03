var https = require('https');
var mysql = require('mysql');


var sqlConnection = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "Te$tL0cal",
  database: "userInformation"
})






function addUser(userName="null", firstName="null", lastName="null", 
                 passHash="null", keyLink="null") {
 
  var options = {
    host: kieyLink, //'google.com',
    port: 443,
    method: 'GET'
  };
 
  var req = https.request(options, function(res) {
    var cert = res.connection.getPeerCertificate();
    //console.log(cert);
    
   
    ///  Connect to mysql database  ///
    sqlConnection.connect((err) => {
      if(err){
        console.log('Error connecting to Db');
        return;
      }
      console.log('Connection established');
    });

    // TODO: make sure username/key has not been used before

    var sql = "INSERT INTO userInfoTable2 (UserName, FirstName, LastName, Company, Country, City, Password, KeyLink, PublicKey) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    var values = [userName, firstName, lastName, 
                  cert['subject']['O'], cert['subject']['C'], 
                  cert['subject']['L'], passHash, keyLink, 'key'];

    sqlConnection.query(sql, values, function (err, result) {
      if (err) {
        console.log("error");
        throw err;
      }
      console.log("Inserted at " + result.insertId);
    });

    sqlConnection.end();

    return true;

  });

  req.end();
}

addUser("h", "e", "l", "l", "o");
//req.end();
