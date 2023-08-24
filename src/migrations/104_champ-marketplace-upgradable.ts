import { Address, Network } from "../types";
import { DEFAULT_ADMIN_ROLE, FEE_MANAGER_ROLE, OPTION_ROLE } from "../roles";
import {
  L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER,
  L2_UNAGI_MINTER_BCI,
} from "../config";
import {
  deployProxy,
  validateImplementation,
  admin,
} from "@openzeppelin/truffle-upgrades";
import { ChampMarketplaceInstance } from "../../types/truffle-contracts";
import {
  ContractClass,
  Deployer,
} from "@openzeppelin/truffle-upgrades/src/utils/truffle";

const ChampMarketplace = artifacts.require(
  "ChampMarketplace"
) as any as ContractClass;
const CHAMP_TOKEN_POLYGON = "0xED755dBa6Ec1eb520076Cec051a582A6d81A8253";
const NFCHAMP_POLYGON = "0x7f61345BDd61b4192324d612fcECD795cE4b60bd";

module.exports =
  () => async (deployer: Deployer, network: Network, accounts: Address[]) => {
    if (network === "test") {
      console.log("Deployment disabled for tests");
      return;
    }

    await validateImplementation(ChampMarketplace, { kind: "transparent" });

    const rootAccount = accounts[0];

    const champMarketplaceContract = (await deployProxy(
      ChampMarketplace,
      [CHAMP_TOKEN_POLYGON, NFCHAMP_POLYGON],
      { deployer }
    )) as ChampMarketplaceInstance;

    console.log("Setup roles for ChampMarketplace");

    await champMarketplaceContract.setMarketplaceFeesReceiver(
      "0xa6A47E2Ad1dC0680308B16731285a8F1476473C8"
    );

    const marketplaceFees: [number, number, number] = [9, 5, 1];
    await champMarketplaceContract.setMarketplacePercentFees(
      ...marketplaceFees
    );
    await champMarketplaceContract.grantRole(
      DEFAULT_ADMIN_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await champMarketplaceContract.grantRole(
      FEE_MANAGER_ROLE,
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER
    );
    await champMarketplaceContract.grantRole(OPTION_ROLE, L2_UNAGI_MINTER_BCI);
    await champMarketplaceContract.renounceRole(
      DEFAULT_ADMIN_ROLE,
      rootAccount
    );
    await champMarketplaceContract.renounceRole(FEE_MANAGER_ROLE, rootAccount);
    await champMarketplaceContract.renounceRole(OPTION_ROLE, rootAccount);
    await admin.transferProxyAdminOwnership(
      L2_UNAGI_MAINTENANCE_TIMELOCK_CONTROLLER,
      { deployer }
    );
  };
