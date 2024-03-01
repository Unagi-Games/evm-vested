import {
  ChampMarketplaceInstance,
  ChildChampTokenInstance,
  UltimateChampionsNFTInstance,
} from "../types/truffle-contracts";
import { NewChampMarketplace } from "./ChampMarketplace.service";

const NFT = artifacts.require("UltimateChampionsNFT");
const Token = artifacts.require("ChildChampToken");

contract("Marketplace", (accounts) => {
  let marketContract: ChampMarketplaceInstance;
  before(async () => {
    marketContract = await NewChampMarketplace(
      (
        await Token.new(accounts[0])
      ).address,
      (
        await NFT.new(0)
      ).address
    );
  });

  it("Should set marketplace marketplaceFeesReceiver", async function () {
    await marketContract.setMarketplaceFeesReceiver(accounts[1]);
    expect(await marketContract.marketplaceFeesReceiver()).to.equals(
      accounts[1]
    );
  });

  it("Should emit MarketplaceFeesReceiverUpdated", async function () {
    const feeReceiver = accounts[1];
    const { receipt: editFeesReceiverReceipt } =
      await marketContract.setMarketplaceFeesReceiver(feeReceiver);

    const editFeesReceiverEvent = editFeesReceiverReceipt.logs.find(
      ({ event }) => event === "MarketplaceFeesReceiverUpdated"
    );
    expect(editFeesReceiverEvent.args.feesReceiver).to.equals(feeReceiver);
  });

  it("Should set marketplace fees", async function () {
    const [sellFee, buyFee, burnFee] = [9, 5, 1];
    await marketContract.setMarketplacePercentFees(sellFee, buyFee, burnFee);
    const {
      0: mpSellFee,
      1: mpBuyFee,
      2: mpBurnFee,
    } = await marketContract.marketplacePercentFees();

    expect(mpSellFee.toNumber()).to.equals(sellFee);
    expect(mpBuyFee.toNumber()).to.equals(buyFee);
    expect(mpBurnFee.toNumber()).to.equals(burnFee);
  });

  it("Should emit MarketplaceFeesUpdated", async function () {
    const [sellFee, buyFee, burnFee] = [10, 15, 11];
    const { receipt: editFeesReceipt } =
      await marketContract.setMarketplacePercentFees(sellFee, buyFee, burnFee);
    const editFeesEvent = editFeesReceipt.logs.find(
      ({ event }) => event === "MarketplaceFeesUpdated"
    );

    expect(editFeesEvent.args.sellerPercentFees.toNumber()).to.equals(sellFee);
    expect(editFeesEvent.args.buyerPercentFees.toNumber()).to.equals(buyFee);
    expect(editFeesEvent.args.burnPercentFees.toNumber()).to.equals(burnFee);
  });

  it("Should throw if deductable marketplace fees add up to more than 100", async function () {
    try {
      await marketContract.setMarketplacePercentFees(101, 0, 0);
      assert.fail("setMarketplacePercentFees() did not throw.");
    } catch (e: any) {
      expect(e.message).to.includes("should be below 100");
    }
    try {
      await marketContract.setMarketplacePercentFees(90, 0, 11);
      assert.fail("setMarketplacePercentFees() did not throw.");
    } catch (e: any) {
      expect(e.message).to.includes("should be below 100");
    }
  });

  it("Should throw if marketplace fees is less than 0", async function () {
    try {
      await marketContract.setMarketplacePercentFees(-1, 0, 0);
      assert.fail("setMarketplacePercentFees() did not throw.");
    } catch (e: any) {
      expect(e.message).to.includes("value out-of-bounds");
    }
  });

  describe("Should share sale between fees receiver, seller and burn address", async function () {
    type FeesTuple = [number, number, number];
    type TestCase = [
      string, // Title
      number, // Sale price
      FeesTuple, // Marketplace fees
      number, // Expectation for seller
      number, // Expectation for fees receiver
      number // Expectation for burn address
    ];

    const tests: TestCase[] = [
      ["Common case", 100, [4, 1, 1], 95, 5, 1],
      ["Price too low for split", 2, [5, 5, 2], 2, 0, 0],
      ["Round should be in favor of seller", 99, [5, 2, 2], 94, 5, 1],
      ["0% fees", 50, [0, 0, 0], 50, 0, 0],
      ["100% sell fees", 50, [100, 0, 0], 0, 50, 0],
      ["100% buy fees", 50, [0, 100, 0], 50, 50, 0],
      ["100% burn fees", 50, [0, 0, 100], 0, 0, 50],
    ];

    const rootUser = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];
    const marketplaceFeesReceiver = accounts[3];
    const burnAddress = "0x000000000000000000000000000000000000dEaD";
    let nftContract: UltimateChampionsNFTInstance;
    let tokenContract: ChildChampTokenInstance;
    let nft: number;

    beforeEach(async function () {
      nftContract = await NFT.new(0);
      tokenContract = await Token.new(accounts[0]);
      marketContract = await NewChampMarketplace(
        tokenContract.address,
        nftContract.address
      );
      await marketContract.setMarketplaceFeesReceiver(marketplaceFeesReceiver);

      // Let's give our buyer some UNA token
      await tokenContract.grantRole(
        await tokenContract.DEPOSITOR_ROLE(),
        rootUser
      );
      await tokenContract.deposit(
        buyer,
        "0x00000000000000000000000000000000000000000000000000000000000f424075696e74323536"
      );

      const { receipt: mintReceipt } = await nftContract.safeMint(
        rootUser,
        "NFT"
      );
      const transferEvent = mintReceipt.logs.find(
        ({ event }) => event === "Transfer"
      );
      nft = transferEvent.args.tokenId.toNumber();
      await nftContract.methods["safeTransferFrom(address,address,uint256)"](
        rootUser,
        seller,
        nft
      );
    });

    tests.forEach(
      ([
        title,
        price,
        fees,
        expectedSellerTokens,
        expectedFeesToken,
        expectedBurnedToken,
      ]) => {
        it(`Scenario: ${title}`, async function () {
          const initialSellerBalance = (
            await tokenContract.balanceOf(seller)
          ).toNumber();
          const initialFeesBalance = (
            await tokenContract.balanceOf(marketplaceFeesReceiver)
          ).toNumber();
          const initialBurnBalance = (
            await tokenContract.balanceOf(burnAddress)
          ).toNumber();

          await marketContract.setMarketplacePercentFees(...fees);

          // Create sale
          await nftContract.approve(marketContract.address, nft, {
            from: seller,
          });
          await marketContract.methods[
            "createSaleFrom(address,uint64,uint256)"
          ](seller, nft, price, {
            from: seller,
          });

          // Accept the sale
          const buyerPrice = await marketContract.getBuyerSalePrice(nft);
          await tokenContract.approve(marketContract.address, buyerPrice, {
            from: buyer,
          });
          await marketContract.methods["acceptSale(uint64,uint256)"](
            nft,
            price,
            { from: buyer }
          );

          // Check final state
          expect(
            (await tokenContract.balanceOf(seller)).toNumber(),
            "seller balance"
          ).to.equals(initialSellerBalance + expectedSellerTokens);
          expect(
            (await tokenContract.balanceOf(marketplaceFeesReceiver)).toNumber(),
            "marketplaceFeesReceiver balance"
          ).to.equals(initialFeesBalance + expectedFeesToken);
          expect(
            (await tokenContract.balanceOf(burnAddress)).toNumber(),
            "marketplaceFeesReceiver balance"
          ).to.equals(initialBurnBalance + expectedBurnedToken);
        });
      }
    );
  });
});
