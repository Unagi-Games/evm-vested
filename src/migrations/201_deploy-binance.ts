import { Address, Network } from "../types";
import { admin, deployProxy, validateImplementation } from "@openzeppelin/truffle-upgrades";
import { ChampMarketplaceInstance } from "../../types/truffle-contracts";
import {
  DEFAULT_ADMIN_ROLE,
  DISTRIBUTOR_ROLE,
  FEE_MANAGER_ROLE,
  MINT_ROLE,
  OPTION_ROLE,
  PAUSER_ROLE,
  RECEIVER_ROLE,
  TOKEN_ROLE
} from "../roles";
import {
  BINANCE_UNAGI_MAINTENANCE_MULTISIG,
  BINANCE_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER,
  BINANCE_UNAGI_MINTER_BCI
} from "../config";

const ERC777Proxy = artifacts.require("ERC777Proxy");
const UltimateChampionsNFT = artifacts.require("UltimateChampionsNFT");
const ChampMarketplace = artifacts.require("ChampMarketplace");
const DistributionManager = artifacts.require("DistributionManager");
const PaymentRelay = artifacts.require("PaymentRelay");

const CHAMP_TOKEN_BINANCE = "0x7e9ab560d37e62883e882474b096643cab234b65";
// Unagi operation -> 3
const PAYMENT_RECEIVER = "0xDE99C51f634A2879f648DCB9aA7be5d6443B1BE5";

module.exports =
  () =>
    async (deployer: Truffle.Deployer, network: Network, accounts: Address[]) => {
      if (network === "test") {
        console.log("Deployment disabled for tests");
        return;
      }
      const rootAccount = accounts[0];

      //////////////////////////////////////////////////////////////
      // Deploy NFCHAMP
      //////////////////////////////////////////////////////////////
      await deployer.deploy(UltimateChampionsNFT, "0x0000000000000000000000000000000000000000000000000000000100000000");
      const ultimateChampionsNFT = await UltimateChampionsNFT.deployed();
      await ultimateChampionsNFT.grantRole(
        DEFAULT_ADMIN_ROLE,
        BINANCE_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
      );
      await ultimateChampionsNFT.grantRole(
        PAUSER_ROLE,
        BINANCE_UNAGI_MAINTENANCE_MULTISIG
      );
      await ultimateChampionsNFT.grantRole(
        MINT_ROLE,
        BINANCE_UNAGI_MINTER_BCI
      );
      await ultimateChampionsNFT.renounceRole(
        DEFAULT_ADMIN_ROLE,
        rootAccount
      );
      await ultimateChampionsNFT.renounceRole(PAUSER_ROLE, rootAccount);
      await ultimateChampionsNFT.renounceRole(MINT_ROLE, rootAccount);

      //////////////////////////////////////////////////////////////
      // Deploy ERC777Proxy for ERC777 compatibility
      //////////////////////////////////////////////////////////////
      await deployer.deploy(ERC777Proxy, CHAMP_TOKEN_BINANCE);
      const erc777Proxy = await ERC777Proxy.deployed();

      //////////////////////////////////////////////////////////////
      // Deploy marketplace
      //////////////////////////////////////////////////////////////
      await validateImplementation(ChampMarketplace as any, { kind: "transparent" });
      const champMarketplace = await deployProxy(
        ChampMarketplace as any,
        [erc777Proxy.address, ultimateChampionsNFT.address],
        { deployer: deployer as any }
      ) as ChampMarketplaceInstance;
      await champMarketplace.approveERC777Proxy();
      await champMarketplace.grantRole(
        DEFAULT_ADMIN_ROLE,
        BINANCE_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
      );
      await champMarketplace.grantRole(
        FEE_MANAGER_ROLE,
        BINANCE_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
      );
      await champMarketplace.grantRole(
        OPTION_ROLE,
        BINANCE_UNAGI_MINTER_BCI
      );
      await champMarketplace.renounceRole(
        DEFAULT_ADMIN_ROLE,
        rootAccount
      );
      await champMarketplace.renounceRole(
        FEE_MANAGER_ROLE,
        rootAccount
      );
      await champMarketplace.renounceRole(
        OPTION_ROLE,
        rootAccount
      );
      await admin.transferProxyAdminOwnership(BINANCE_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER, { deployer: deployer as any });
      
      //////////////////////////////////////////////////////////////
      // Deploy DistributionManager
      //////////////////////////////////////////////////////////////
      await deployer.deploy(
        DistributionManager,
        CHAMP_TOKEN_BINANCE,
        "0x0000000000000000000000000000000000000000",
        ultimateChampionsNFT.address,
      );
      const distributionManager = await DistributionManager.deployed();
      await distributionManager.grantRole(
        DEFAULT_ADMIN_ROLE,
        BINANCE_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
      );
      await distributionManager.grantRole(
        PAUSER_ROLE,
        BINANCE_UNAGI_MAINTENANCE_MULTISIG
      );
      await distributionManager.grantRole(
        DISTRIBUTOR_ROLE,
        BINANCE_UNAGI_MINTER_BCI
      );
      await distributionManager.renounceRole(
        DEFAULT_ADMIN_ROLE,
        rootAccount
      );
      await distributionManager.renounceRole(PAUSER_ROLE, rootAccount);
      await distributionManager.renounceRole(
        DISTRIBUTOR_ROLE,
        rootAccount
      );

      //////////////////////////////////////////////////////////////
      // Deploy PaymentRelay
      //////////////////////////////////////////////////////////////
      await deployer.deploy(PaymentRelay);
      const paymentRelay = await PaymentRelay.deployed();

      await paymentRelay.grantRole(
        DEFAULT_ADMIN_ROLE,
        BINANCE_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
      );
      await paymentRelay.grantRole(
        RECEIVER_ROLE,
        PAYMENT_RECEIVER
      );
      await paymentRelay.grantRole(
        TOKEN_ROLE,
        erc777Proxy.address
      );
      await paymentRelay.approveERC777Proxy(erc777Proxy.address);
      await paymentRelay.renounceRole(
        DEFAULT_ADMIN_ROLE,
        rootAccount
      );
      await paymentRelay.renounceRole(
        TOKEN_ROLE,
        rootAccount
      );
      await paymentRelay.renounceRole(
        RECEIVER_ROLE,
        rootAccount
      );
    };
