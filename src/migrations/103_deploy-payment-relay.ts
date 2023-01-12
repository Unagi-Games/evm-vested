import { DEFAULT_ADMIN_ROLE, RECEIVER_ROLE, TOKEN_ROLE } from "../roles";
import { L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER, } from "../config";
import { Address, Network } from "../types";

const ChildChamp = artifacts.require("ChildChampToken");
const ChildMgc = artifacts.require("ChildMgcToken");
const PaymentRelay = artifacts.require("PaymentRelay");

const receiver = "";

module.exports =
  () =>
  async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
    if (network === "test") {
      console.log("Deployment disabled for tests");
      return;
    }

    const rootAccount = accounts[0];

    await deployer.deploy(PaymentRelay);

    const paymentRelayContract = await PaymentRelay.deployed();
    const champContract = await ChildChamp.deployed();
    const mgcContract = await ChildMgc.deployed();

    await paymentRelayContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await paymentRelayContract.grantRole(
      RECEIVER_ROLE,
      receiver
    );
    await paymentRelayContract.grantRole(
      TOKEN_ROLE,
      champContract.address
    );
    await paymentRelayContract.grantRole(
      TOKEN_ROLE,
      mgcContract.address
    );
    await paymentRelayContract.renounceRole(
      DEFAULT_ADMIN_ROLE,
      rootAccount
    );
    await paymentRelayContract.renounceRole(
      TOKEN_ROLE,
      rootAccount
    );
    await paymentRelayContract.renounceRole(
      RECEIVER_ROLE,
      rootAccount
    );
  };
