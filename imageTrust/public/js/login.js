function loginData() {
  console.log("in logindata");
  var inpUserName = document.getElementById("userName").value;
  var inpPassword = document.getElementById("password").value;
  console.log("USERNAME");
  console.log(inpUserName);
  //console.log("Stringified UN" + inpUserName.toString());

  let lgDB = {
    userName: inpUserName,  //"testUser0",
    passHash: inpPassword  //"superdupersecret",
  };
  console.log(lgDB);
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lgDB),
  }).then(function(res) {
     console.log(res.status);
    if (res.status == 200) {
      console.log("signedin");
      window.location.href="../validation.html";
    }
    else if (res.status == 401) {
      console.log("failedin");
    }
    else {
      throw err;
    }
  });
}
