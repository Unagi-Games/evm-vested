import { Address, Network } from "../types";
import { DEFAULT_ADMIN_ROLE, FEE_MANAGER_ROLE } from "../roles";
import { L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER } from "../config";
import { deployProxy, validateImplementation, admin } from "@openzeppelin/truffle-upgrades";
import { ChampMarketplaceInstance } from "../../types/truffle-contracts";
import { ContractClass, Deployer } from "@openzeppelin/truffle-upgrades/src/utils/truffle";

const ChampMarketplace = artifacts.require("ChampMarketplace") as any as ContractClass;

module.exports =
  () =>
  async (deployer: Deployer, network: Network, accounts: Address[]) => {
    if (network === "test") {
      console.log("Deployment disabled for tests");
      return;
    }

    await validateImplementation(ChampMarketplace, { kind: "transparent" });

    const rootAccount = accounts[0];

    const champMarketplaceContract = await deployProxy(ChampMarketplace, ["0xED755dBa6Ec1eb520076Cec051a582A6d81A8253", "0x7f61345BDd61b4192324d612fcECD795cE4b60bd"], { deployer }) as ChampMarketplaceInstance;

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
    await admin.transferProxyAdminOwnership(L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER, { deployer });
  };
