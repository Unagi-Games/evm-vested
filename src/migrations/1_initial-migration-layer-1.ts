const L1Migrations = artifacts.require("Migrations");

module.exports = () => (deployer: Truffle.Deployer) => {
  deployer.deploy(L1Migrations);
};
