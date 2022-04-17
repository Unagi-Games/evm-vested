const L2Migrations = artifacts.require("Migrations");

module.exports = () => (deployer: Truffle.Deployer) => {
  deployer.deploy(L2Migrations);
};
