import { Network } from "../types";
import { prepareUpgrade } from "@openzeppelin/truffle-upgrades";
const ChampMarketplace = artifacts.require("ChampMarketplace");

module.exports = () => async (deployer: Truffle.Deployer, network: Network) => {
  if (network === "test") {
    console.log("Deployment disabled for tests");
    return;
  }
  const existing = await ChampMarketplace.at(
    "0xFd4cb3eb2325D81B5f091447513A1312A4F57618"
  );
  await prepareUpgrade(existing, ChampMarketplace as any, {
    deployer: deployer as any,
    unsafeSkipStorageCheck: true
  });
};
