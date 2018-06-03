var https = require('https');
var mysql = require('mysql');


var sqlConnection = mysql.createConnection({
  host: "localhost",
  user: "test",
  password: "Te$tL0cal",
  database: "testCompany"
})


function getLicensePrice(software) {

  sqlConnection.connect((err) => {
    if (err) {
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });

  var sql = "SELECT price FROM license WHERE name = ?";
  var value = [software]
  sqlConnection.query(sql, value, function (err, result) {
    if (err) {
      console.log("error");
      sqlConnection.end();
      throw err;
    }
    console.log("result: " + JSON.stringify(result));
    console.log(result[0].price);

    sqlConnection.end();
    return result[0];
  });
}

var price = getLicensePrice("software1");

