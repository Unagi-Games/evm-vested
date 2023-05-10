import { DEFAULT_ADMIN_ROLE, OPERATOR_ROLE, MAINTENANCE_ROLE } from "../roles";
import {
  L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER,
  L2_UNAGI_MAINTENANCE_MULTISIG,
} from "../config";
import { Address, Network } from "../types";

const UltimateChampionsNFT = artifacts.require("UltimateChampionsNFT");
const ChildChampToken = artifacts.require("ChildChampToken");
const TokenTransferRelay = artifacts.require("TokenTransferRelay");

const TRANSFER_RELAY_OPERATOR = L2_UNAGI_MAINTENANCE_MULTISIG;
const ERC721_RECEIVER = "0x000000000000000000000000000000000000dEaD";
const ERC20_RECEIVER = "";

module.exports =
  () =>
  async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
    if (network === "test") {
      console.log("Deployment disabled for tests");
      return;
    }

    const rootAccount = accounts[0];

    const ultimateChampionsNFTContract = await UltimateChampionsNFT.deployed();
    const childChampToken = await ChildChampToken.deployed();
    await deployer.deploy(
      TokenTransferRelay,
      ultimateChampionsNFTContract.address,
      childChampToken.address,
      ERC721_RECEIVER,
      ERC20_RECEIVER
    );
    const tokenTransferRelayContract = await TokenTransferRelay.deployed();

    await tokenTransferRelayContract.grantRole(
      OPERATOR_ROLE,
      TRANSFER_RELAY_OPERATOR
    );
    await tokenTransferRelayContract.grantRole(
      MAINTENANCE_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await tokenTransferRelayContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await tokenTransferRelayContract.renounceRole(
      DEFAULT_ADMIN_ROLE,
      rootAccount
    );
  };
