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
    await marketContract.setMarketplacePercentFees(1);
    expect(
      (await marketContract.marketplacePercentFees()).toNumber()
    ).to.equals(1);
  });

  it("Should emit MarketplaceFeesUpdated", async function () {
    const fees = 20;
    await marketContract.setMarketplacePercentFees(fees);
    const { receipt: editFeesReceipt } =
      await marketContract.setMarketplacePercentFees(fees);

    const editFeesEvent = editFeesReceipt.logs.find(
      ({ event }) => event === "MarketplaceFeesUpdated"
    );
    expect(editFeesEvent.args.percentFees.toNumber()).to.equals(fees);
  });

  it("Should throw if marketplace fees is more than 100", async function () {
    try {
      await marketContract.setMarketplacePercentFees(101);
      assert.fail("setMarketplacePercentFees() did not throw.");
    } catch (e: any) {
      expect(e.message).to.includes("should be below 100");
    }
  });

  it("Should throw if marketplace fees is less than 0", async function () {
    try {
      await marketContract.setMarketplacePercentFees(-1);
      assert.fail("setMarketplacePercentFees() did not throw.");
    } catch (e: any) {
      expect(e.message).to.includes("value out-of-bounds");
    }
  });

  describe("Should share sale between fees receiver and seller", async function () {
    type TestCase = [
      string, // Title
      number, // Sale price
      number, // Marketplace fees
      number, // Expectation for seller
      number // Expectation for fees receiver
    ];

    const tests: TestCase[] = [
      ["Common case", 100, 5, 95, 5],
      ["Price too low for split", 1, 5, 1, 0],
      ["Round should be in favor of seller", 99, 5, 95, 4],
      ["0% fees", 50, 0, 50, 0],
      ["100% fees", 50, 100, 0, 50],
    ];

    const rootUser = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];
    const marketplaceFeesReceiver = accounts[3];
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
        rootUser,
        "0x00000000000000000000000000000000000000000000000000000000000f424075696e74323536"
      );
      await tokenContract.send(buyer, 1_000_000, "0x0");

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
      ([title, price, fees, expectedSellerTokens, expectedFeesToken]) => {
        it(`Scenario: ${title}`, async function () {
          const initialSellerBalance = (
            await tokenContract.balanceOf(seller)
          ).toNumber();
          const initialFeesBalance = (
            await tokenContract.balanceOf(marketplaceFeesReceiver)
          ).toNumber();

          await marketContract.setMarketplacePercentFees(fees);

          // Create sale
          await nftContract.approve(marketContract.address, nft, {
            from: seller,
          });
          await marketContract['createSaleFrom(address,uint64,uint256)'](seller, nft, price, {
            from: seller,
          });

          // Accept the sale
          await tokenContract.approve(marketContract.address, price, {
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
        });
      }
    );
  });
});
