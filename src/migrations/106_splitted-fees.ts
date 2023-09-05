import { Network } from "../types";
import { prepareUpgrade } from "@openzeppelin/truffle-upgrades";
const ChampMarketplace = artifacts.require("ChampMarketplace");

module.exports = () => async (deployer: Truffle.Deployer, network: Network) => {
  if (network === "test") {
    console.log("Deployment disabled for tests");
    return;
  }
  const existing = await ChampMarketplace.at(
    "0xe6bf498d187013115d432c69bc5dd9f4c062a1f9"
  );
  await prepareUpgrade(existing, ChampMarketplace as any, {
    deployer: deployer as any,
    unsafeSkipStorageCheck: true
  });
};
