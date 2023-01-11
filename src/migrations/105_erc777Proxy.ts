import { Network } from "../types";

const ERC777Proxy = artifacts.require("ERC777Proxy");

module.exports =
  () =>
  async (deployer: Truffle.Deployer, network: Network) => {
    if (network === "test") {
      console.log("Deployment disabled for tests");
      return;
    }

    await deployer.deploy(ERC777Proxy, "0xC8A091129fC1A365Fb64484b381f4f454eC008d1");
  };
