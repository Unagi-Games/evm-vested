import { DEFAULT_ADMIN_ROLE, RECEIVER_ROLE, TOKEN_ROLE } from "../roles";
import { L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER } from "../config";
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

    await nftBurnerContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await nftBurnerContract.grantRole(RECEIVER_ROLE, operator);
    await nftBurnerContract.renounceRole(DEFAULT_ADMIN_ROLE, rootAccount);
  };
