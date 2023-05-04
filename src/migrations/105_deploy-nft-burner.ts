import { DEFAULT_ADMIN_ROLE, OPERATOR_ROLE } from "../roles";
import { Address, Network } from "../types";

const UltimateChampionsNFT = artifacts.require("UltimateChampionsNFT");
const NFTBurner = artifacts.require("NFTBurner");

const operator = "";

module.exports =
  () =>
  async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
    if (network === "test") {
      console.log("Deployment disabled for tests");
      return;
    }

    const rootAccount = accounts[0];

    const ultimateChampionsNFTContract = await UltimateChampionsNFT.deployed();
    await deployer.deploy(NFTBurner, ultimateChampionsNFTContract.address);
    const nftBurnerContract = await NFTBurner.deployed();

    await nftBurnerContract.grantRole(OPERATOR_ROLE, operator);
    await nftBurnerContract.renounceRole(DEFAULT_ADMIN_ROLE, rootAccount);
  };
