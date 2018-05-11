var codeValidation = artifacts.require("codeValidation");  
module.exports = function(deployer) {
    deployer.deploy(codeValidation, "IBM");
};

