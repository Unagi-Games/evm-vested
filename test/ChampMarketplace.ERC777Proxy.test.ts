import {
  ChampMarketplaceInstance,
  ERC20Instance, ERC777ProxyInstance,
  UltimateChampionsNFTInstance,
} from "../types/truffle-contracts";
import { NewChampMarketplace } from "./ChampMarketplace.service";

const NFT = artifacts.require("UltimateChampionsNFT");
const ERC20 = artifacts.require("TestERC20");
const ERC777Proxy = artifacts.require("ERC777Proxy");

contract("Marketplace & ERC777Proxy", (accounts) => {
  const SALE_PRICE = 100;

  const operator = accounts[0];
  const seller = accounts[1];
  const buyer = accounts[2];
  let nft: number;
  let erc20: ERC20Instance;
  let erc777Proxy: ERC777ProxyInstance;
  let nftContract: UltimateChampionsNFTInstance;
  let marketContract: ChampMarketplaceInstance;

  before(async () => {
    erc20 = await ERC20.new("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    erc777Proxy = await ERC777Proxy.new(erc20.address);
    nftContract = await NFT.new(0);
    marketContract = await NewChampMarketplace(
      erc777Proxy.address,
      nftContract.address
    );
    await marketContract.approveERC777Proxy();

    // Set operator as... an operator
    await erc20.approve(erc777Proxy.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff", { from: buyer });
    await erc777Proxy.authorizeOperator(operator, { from: buyer });

    // Let's give our buyer some UNA token
    await erc20.transfer(
      buyer,
      SALE_PRICE * 100
    );
  });

  beforeEach(async () => {
    // Let's give our seller a NFT
    const { receipt: mintReceipt } = await nftContract.safeMint(
      seller,
      "NFT_1"
    );
    const transferEvent = mintReceipt.logs.find(
      ({ event }) => event === "Transfer"
    );
    nft = transferEvent.args.tokenId.toNumber();
  });

  it("E2E Allow to exchange NFT & ERC20 with ERC777 methods", async function () {
    const initialSellerBalance = (
      await erc20.balanceOf(seller)
    ).toNumber();
    const initialBuyerBalance = (
      await erc20.balanceOf(buyer)
    ).toNumber();

    // Check initial state
    expect(await nftContract.ownerOf(nft)).to.equals(seller);

    // Create the sale
    await nftContract.approve(marketContract.address, nft, {
      from: seller,
    });
    await marketContract.createSaleFrom(seller, nft, SALE_PRICE, {
      from: seller,
    });

    // Accept the sale
    await erc777Proxy.send(
      marketContract.address,
      SALE_PRICE,
      web3.utils.padLeft(web3.utils.toHex(nft), 16),
      { from: buyer }
    );
    const saleAcceptedEvents = await marketContract.getPastEvents(
      "SaleAccepted"
    );
    expect(saleAcceptedEvents, "SaleAccepted events count").to.have.length(
      1
    );
    expect(saleAcceptedEvents[0].returnValues.tokenId).to.equals(
      String(nft)
    );

    // Check final state
    expect(await nftContract.ownerOf(nft)).to.equals(buyer);
    expect(await nftContract.getApproved(nft)).to.equals(
      "0x0000000000000000000000000000000000000000"
    );
    expect((await erc20.balanceOf(seller)).toNumber()).to.equals(
      initialSellerBalance + SALE_PRICE
    );
    expect((await erc20.balanceOf(buyer)).toNumber()).to.equals(
      initialBuyerBalance - SALE_PRICE
    );
  });
});