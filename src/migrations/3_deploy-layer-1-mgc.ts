const Mgctoken = artifacts.require("MgcToken");

const PREDICATE_PROXY = "0x932532aA4c0174b8453839A6E44eE09Cc615F2b7";

module.exports = () => async (deployer: Truffle.Deployer) => {
  await deployer.deploy(Mgctoken, PREDICATE_PROXY);
};
