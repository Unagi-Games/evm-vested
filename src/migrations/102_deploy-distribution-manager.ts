import { DEFAULT_ADMIN_ROLE, DISTRIBUTOR_ROLE, PAUSER_ROLE } from "../roles";
import {
  L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER,
  L2_UNAGI_MINTER_BCI,
  L2_UNAGI_MAINTENANCE_MULTISIG,
} from "../config";
import { Address, Network } from "../types";

const ChildChampToken = artifacts.require("ChildChampToken");
const ChildMgcToken = artifacts.require("ChildMgcToken");
const UltimateChampionsNFT = artifacts.require("UltimateChampionsNFT");
const DistributionManager = artifacts.require("DistributionManager");

module.exports =
  () =>
  async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
    if (network === "test") {
      console.log("Deployment disabled for tests");
      return;
    }

    const rootAccount = accounts[0];

    const childChampTokenContract = await ChildChampToken.deployed();
    const childMgcTokenContract = await ChildMgcToken.deployed();
    const ultimateChampionsNFTContract = await UltimateChampionsNFT.deployed();

    await deployer.deploy(
      DistributionManager,
      childChampTokenContract.address,
      childMgcTokenContract.address,
      ultimateChampionsNFTContract.address
    );
    const distributionManagerContract = await DistributionManager.deployed();

    await distributionManagerContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await distributionManagerContract.grantRole(
      PAUSER_ROLE,
      L2_UNAGI_MAINTENANCE_MULTISIG
    );
    await distributionManagerContract.grantRole(
      DISTRIBUTOR_ROLE,
      L2_UNAGI_MINTER_BCI
    );
    await distributionManagerContract.renounceRole(
      DEFAULT_ADMIN_ROLE,
      rootAccount
    );
    await distributionManagerContract.renounceRole(PAUSER_ROLE, rootAccount);
    await distributionManagerContract.renounceRole(
      DISTRIBUTOR_ROLE,
      rootAccount
    );
  };
