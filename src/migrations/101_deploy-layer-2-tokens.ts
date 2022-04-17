import { DEFAULT_ADMIN_ROLE, PAUSER_ROLE, MINTER_ROLE } from "../roles";
import {
  L2_UNAGI_MAINTENANCE_MULTISIG,
  L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER,
  L2_UNAGI_MINTER_BCI,
} from "../config";
import { Address, Network } from "../types";

const ChildChampToken = artifacts.require("ChildChampToken");
const ChildMgcToken = artifacts.require("ChildMgcToken");

const CHILD_CHAIN_MANAGER = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa";

module.exports =
  () =>
  async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
    const rootAccount = accounts[0];

    await deployer.deploy(ChildChampToken, CHILD_CHAIN_MANAGER);
    await deployer.deploy(ChildMgcToken, CHILD_CHAIN_MANAGER);
    const childChampTokenContract = await ChildChampToken.deployed();
    const childMgcTokenContract = await ChildMgcToken.deployed();

    await childChampTokenContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await childChampTokenContract.grantRole(
      PAUSER_ROLE,
      L2_UNAGI_MAINTENANCE_MULTISIG
    );
    await childChampTokenContract.renounceRole(DEFAULT_ADMIN_ROLE, rootAccount);
    await childChampTokenContract.renounceRole(PAUSER_ROLE, rootAccount);

    await childMgcTokenContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await childMgcTokenContract.grantRole(
      PAUSER_ROLE,
      L2_UNAGI_MAINTENANCE_MULTISIG
    );
    await childMgcTokenContract.grantRole(MINTER_ROLE, L2_UNAGI_MINTER_BCI);
    await childMgcTokenContract.renounceRole(DEFAULT_ADMIN_ROLE, rootAccount);
    await childMgcTokenContract.renounceRole(PAUSER_ROLE, rootAccount);
    await childMgcTokenContract.renounceRole(MINTER_ROLE, rootAccount);
  };
