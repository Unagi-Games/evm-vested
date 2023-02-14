const BinanceMigrations = artifacts.require("Migrations");

module.exports = () => (deployer: Truffle.Deployer) => {
  deployer.deploy(BinanceMigrations);
};
