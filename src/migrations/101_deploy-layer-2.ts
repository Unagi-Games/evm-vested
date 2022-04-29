import {
  DEFAULT_ADMIN_ROLE,
  FEE_MANAGER_ROLE,
  MINT_ROLE,
  PAUSER_ROLE,
} from "../roles";
import {
  L2_UNAGI_MAINTENANCE_MULTISIG,
  L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER,
  L2_UNAGI_MINTER_BCI,
} from "../config";
import { Address, Network } from "../types";

const ChildChampToken = artifacts.require("ChildChampToken");
const ChildMgcToken = artifacts.require("ChildMgcToken");
const UltimateChampionsNFT = artifacts.require("UltimateChampionsNFT");
const ChampMarketplace = artifacts.require("ChampMarketplace");

const CHILD_CHAIN_MANAGER = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";

module.exports =
  () =>
  async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
    const rootAccount = accounts[0];

    await deployer.deploy(ChildChampToken, CHILD_CHAIN_MANAGER);
    const childChampTokenContract = await ChildChampToken.deployed();
    if (network !== "test") {
      console.log("Setup roles for ChildChamp");

      await childChampTokenContract.grantRole(
        DEFAULT_ADMIN_ROLE,
        L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
      );
      await childChampTokenContract.grantRole(
        PAUSER_ROLE,
        L2_UNAGI_MAINTENANCE_MULTISIG
      );
      await childChampTokenContract.renounceRole(
        DEFAULT_ADMIN_ROLE,
        rootAccount
      );
      await childChampTokenContract.renounceRole(PAUSER_ROLE, rootAccount);
    }

    await deployer.deploy(ChildMgcToken, CHILD_CHAIN_MANAGER);
    const childMgcTokenContract = await ChildMgcToken.deployed();
    if (network !== "test") {
      console.log("Setup roles for ChildMgc");

      await childMgcTokenContract.grantRole(
        DEFAULT_ADMIN_ROLE,
        L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
      );
      await childMgcTokenContract.grantRole(
        PAUSER_ROLE,
        L2_UNAGI_MAINTENANCE_MULTISIG
      );
      await childMgcTokenContract.grantRole(MINT_ROLE, L2_UNAGI_MINTER_BCI);
      await childMgcTokenContract.renounceRole(DEFAULT_ADMIN_ROLE, rootAccount);
      await childMgcTokenContract.renounceRole(PAUSER_ROLE, rootAccount);
      await childMgcTokenContract.renounceRole(MINT_ROLE, rootAccount);
    }

    await deployer.deploy(UltimateChampionsNFT);
    const ultimateChampionsNFTContract = await UltimateChampionsNFT.deployed();
    if (network !== "test") {
      console.log("Setup roles for UltimateChampionsNFT");

      await ultimateChampionsNFTContract.grantRole(
        DEFAULT_ADMIN_ROLE,
        L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
      );
      await ultimateChampionsNFTContract.grantRole(
        PAUSER_ROLE,
        L2_UNAGI_MAINTENANCE_MULTISIG
      );
      await ultimateChampionsNFTContract.grantRole(
        MINT_ROLE,
        L2_UNAGI_MINTER_BCI
      );
      await ultimateChampionsNFTContract.renounceRole(
        DEFAULT_ADMIN_ROLE,
        rootAccount
      );
      await ultimateChampionsNFTContract.renounceRole(PAUSER_ROLE, rootAccount);
      await ultimateChampionsNFTContract.renounceRole(MINT_ROLE, rootAccount);
    }

    await deployer.deploy(
      ChampMarketplace,
      childChampTokenContract.address,
      ultimateChampionsNFTContract.address
    );
    const champMarketplaceContract = await ChampMarketplace.deployed();
    if (network !== "test") {
      console.log("Setup roles for ChampMarketplace");

      await champMarketplaceContract.grantRole(
        DEFAULT_ADMIN_ROLE,
        L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
      );
      await champMarketplaceContract.grantRole(
        FEE_MANAGER_ROLE,
        L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
      );
      await champMarketplaceContract.renounceRole(
        DEFAULT_ADMIN_ROLE,
        rootAccount
      );
      await champMarketplaceContract.renounceRole(
        FEE_MANAGER_ROLE,
        rootAccount
      );
    }
  };
