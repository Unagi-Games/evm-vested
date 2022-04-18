import {
  L1_UNAGI_MAINTENANCE_MULTISIG,
  L1_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER,
} from "../config";
import { DEFAULT_ADMIN_ROLE, PAUSER_ROLE } from "../roles";
import { Address, Network } from "../types";

const Mgctoken = artifacts.require("MgcToken");

const PREDICATE_PROXY = "0x932532aA4c0174b8453839A6E44eE09Cc615F2b7";

module.exports =
  () =>
  async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
    if (network === "test") {
      console.log("Deployment disabled for tests");
      return;
    }
    const rootAccount = accounts[0];

    await deployer.deploy(Mgctoken, PREDICATE_PROXY);
    const mgcTokenContract = await Mgctoken.deployed();

    await mgcTokenContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      L1_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await mgcTokenContract.grantRole(
      PAUSER_ROLE,
      L1_UNAGI_MAINTENANCE_MULTISIG
    );
    await mgcTokenContract.renounceRole(DEFAULT_ADMIN_ROLE, rootAccount);
    await mgcTokenContract.renounceRole(PAUSER_ROLE, rootAccount);
  };
