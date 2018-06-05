licensing = artifacts.require("licenseToken");
module.exports = function(deployer) {
    deployer.deploy(licensing, "license", "IBM", 0x03e2edce4bb10110c3b75d14737100c0c34f7199);
};

