import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, PAUSER_ROLE } from "../roles";
import {
  L2_UNAGI_MAINTENANCE_MULTISIG,
  L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER,
  L2_UNAGI_MINTER_BCI,
} from "../config";
import { Address, Network } from "../types";

const UltimateChampionsNFT = artifacts.require("UltimateChampionsNFT");

module.exports =
  () =>
  async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
    const rootAccount = accounts[0];

    await deployer.deploy(UltimateChampionsNFT);
    const ultimateChampionsNFTContract = await UltimateChampionsNFT.deployed();

    await ultimateChampionsNFTContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await ultimateChampionsNFTContract.grantRole(
      PAUSER_ROLE,
      L2_UNAGI_MAINTENANCE_MULTISIG
    );
    await ultimateChampionsNFTContract.grantRole(
      MINTER_ROLE,
      L2_UNAGI_MINTER_BCI
    );
    await ultimateChampionsNFTContract.renounceRole(
      DEFAULT_ADMIN_ROLE,
      rootAccount
    );
    await ultimateChampionsNFTContract.renounceRole(PAUSER_ROLE, rootAccount);
    await ultimateChampionsNFTContract.renounceRole(MINTER_ROLE, rootAccount);
  };
