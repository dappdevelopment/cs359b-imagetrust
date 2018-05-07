function app()	{
	if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
  	web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
  	console.log("Using web3 version: " + Web3.version);
	
//	var CryptoJS = require("crypto-js");
	console.log(CryptoJS.SHA256("Message"));

$("#file-dialog").change(function()	{
	handleFiles(this.files);
});

function handleFiles(files)	{
	for (var i=0; i<files.length; i++) {
	var fileName = files[i].name;
        var reader = new FileReader();
        reader.onload = function() {
        var sha256Hash = CryptoJS.SHA256(reader.result);
            console.log("Hash is " + sha256Hash);
	document.getElementById("fileDetailsText").innerHTML = "File Details";
	document.getElementById("hashValue").innerHTML = "Hash Value of File: " + sha256Hash;
        document.getElementById("fileName").innerHTML = "File Name: " + fileName;
	var date = new Date().toLocaleString();	
	document.getElementById("timeStamp").innerHTML = "Time Stamp: " + date;
	};
        reader.onerror = function() {
            console.error("Could not read the file");
        };
        reader.readAsBinaryString(files.item(i));
     }
 }
	
//	var getFile = document.getElementById("getFile");
//	getFile.disabled = true;
}

$(document).ready(app);  
