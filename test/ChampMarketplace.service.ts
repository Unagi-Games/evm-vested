const Market = artifacts.require("ChampMarketplace");

export async function NewChampMarketplace(tokenContract: string, nftContract: string) {
  const marketContract = await Market.new();
  await marketContract.initialize(
    tokenContract,
    nftContract
  );
  return marketContract;
}