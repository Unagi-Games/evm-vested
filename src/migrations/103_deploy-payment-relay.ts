import { DEFAULT_ADMIN_ROLE, PAYMENT_ROLE, TOKEN_ROLE } from "../roles";
import { L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER, L2_UNAGI_MINTER_BCI, } from "../config";
import { Address, Network } from "../types";

const ChildChamp = artifacts.require("ChildChampToken");
const ChildMgc = artifacts.require("ChildMgcToken");
const PaymentRelay = artifacts.require("PaymentRelay");

module.exports =
  () =>
  async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
    if (network === "test") {
      console.log("Deployment disabled for tests");
      return;
    }

    const rootAccount = accounts[0];

    await deployer.deploy(PaymentRelay);

    const distributionManagerContract = await PaymentRelay.deployed();
    const champContract = await ChildChamp.deployed();
    const mgcContract = await ChildMgc.deployed();

    await distributionManagerContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await distributionManagerContract.grantRole(
      PAYMENT_ROLE,
      L2_UNAGI_MINTER_BCI
    );
    await distributionManagerContract.grantRole(
      TOKEN_ROLE,
      champContract.address
    );
    await distributionManagerContract.grantRole(
      TOKEN_ROLE,
      mgcContract.address
    );
    await distributionManagerContract.renounceRole(
      DEFAULT_ADMIN_ROLE,
      rootAccount
    );
    await distributionManagerContract.renounceRole(
      TOKEN_ROLE,
      rootAccount
    );
    await distributionManagerContract.renounceRole(
      PAYMENT_ROLE,
      rootAccount
    );
  };
