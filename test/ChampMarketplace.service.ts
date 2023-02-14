import { ChampMarketplaceInstance } from "../types/truffle-contracts";

const Market = artifacts.require("TestChampMarketplace");

export async function NewChampMarketplace(
  tokenContract: string,
  nftContract: string
) {
  const marketContract = await Market.new();
  await marketContract.initialize(tokenContract, nftContract);
  return marketContract as ChampMarketplaceInstance;
}
