const ChildUltimateChampionsNFT = artifacts.require(
  "ChildUltimateChampionsNFT"
);
const ChildChampToken = artifacts.require("ChildChampToken");
const ChildMgcToken = artifacts.require("ChildMgcToken");

const CHILD_CHAIN_MANAGER = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";

module.exports = () => async (deployer: Truffle.Deployer) => {
  await deployer.deploy(ChildChampToken, CHILD_CHAIN_MANAGER);
  await deployer.deploy(ChildMgcToken, CHILD_CHAIN_MANAGER);
  await deployer.deploy(ChildUltimateChampionsNFT, CHILD_CHAIN_MANAGER);
};
