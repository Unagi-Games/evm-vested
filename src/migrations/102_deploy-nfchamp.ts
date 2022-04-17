const UltimateChampionsNFT = artifacts.require("UltimateChampionsNFT");

module.exports = () => async (deployer: Truffle.Deployer) => {
  await deployer.deploy(UltimateChampionsNFT);
};
