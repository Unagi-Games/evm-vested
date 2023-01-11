import TimeMachine from "ganache-time-traveler";
import {
  ChampMarketplaceInstance,
  ChildChampTokenInstance,
  UltimateChampionsNFTInstance,
} from "../types/truffle-contracts";
import { OptionSet } from "../types/truffle-contracts/ChampMarketplace";
import { NewChampMarketplace } from "./ChampMarketplace.service";

const NFT = artifacts.require("UltimateChampionsNFT");
const Token = artifacts.require("ChildChampToken");

contract("Marketplace", (accounts) => {
  describe("as a user", () => {
    const rootUser = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];
    let nft: number;
    let nftContract: UltimateChampionsNFTInstance;
    let tokenContract: ChildChampTokenInstance;
    let marketContract: ChampMarketplaceInstance;

    beforeEach(async () => {
      nftContract = await NFT.new();
      tokenContract = await Token.new(accounts[0]);
      marketContract = await NewChampMarketplace(
        tokenContract.address,
        nftContract.address
      );

      // Let's give our buyer some UNA token
      await tokenContract.grantRole(
        await tokenContract.DEPOSITOR_ROLE(),
        rootUser
      );
      await tokenContract.deposit(
        buyer,
        "0x00000000000000000000000000000000000000000000000000000000000f424075696e74323536"
      );

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

    describe("Options", () => {
      it("Prevents unauthorized users to set an option", async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });

        try {
          await marketContract.setOption(buyer, nft, { from: buyer });
          assert.fail("setOption did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("missing role");
        }

        expect(await marketContract.hasOption(buyer, nft)).to.be.false;
      });

      it("Prevents user to set an option for someone else", async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });
        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          seller
        );

        try {
          await marketContract.setOption(buyer, nft, { from: seller });
          assert.fail("setOption did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Only an authorized operator is allowed");
        }

        expect(await marketContract.hasOption(seller, nft)).to.be.false;
      });

      it("Prevents an other buyer to accept a sale", async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });
        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          seller
        );
        await marketContract.setOption(seller, nft, { from: seller });

        try {
          await tokenContract.send(
            marketContract.address,
            1,
            web3.utils.padLeft(web3.utils.toHex(nft), 16),
            { from: buyer }
          );
          assert.fail("send did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("An option exists on this sale");
        }

        expect(await nftContract.ownerOf(nft)).to.equals(seller);
      });

      it("Prevents the seller to edit his sale", async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });
        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          buyer
        );
        await marketContract.setOption(buyer, nft, { from: buyer });

        try {
          await marketContract.updateSaleFrom(seller, nft, 2, { from: seller });
          assert.fail("updateSaleFrom did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("An option exists on this sale");
        }

        expect((await marketContract.getSale(nft)).toNumber()).to.equals(1);
      });

      it("Prevents the seller to destroy his sale", async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });
        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          buyer
        );
        await marketContract.setOption(buyer, nft, { from: buyer });

        try {
          await marketContract.destroySaleFrom(seller, nft, { from: seller });
          assert.fail("destroySaleFrom did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("An option exists on this sale");
        }

        expect((await marketContract.getSale(nft)).toNumber()).to.equals(1);
      });

      it('Prevents to have multiple option at the same time', async () => {
        const { receipt: mintReceipt } = await nftContract.safeMint(
          seller,
          "NFT_2"
        );
        const transferEvent = mintReceipt.logs.find(
          ({ event }) => event === "Transfer"
        );
        const nft2 = transferEvent.args.tokenId.toNumber();

        for (const tokenId of [nft, nft2]) {
          await nftContract.approve(marketContract.address, tokenId, {
            from: seller,
          });
          await marketContract.createSaleFrom(seller, tokenId, 1, {
            from: seller,
          });
        }

        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          buyer
        );
        await marketContract.setOption(buyer, nft, { from: buyer });

        try {
          await marketContract.setOption(buyer, nft2, { from: buyer });
          assert.fail("setOption did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Cannot set an option on multiple sales at the same time");
        }

        expect(await marketContract.hasOption(buyer, nft2)).to.be.false;
      });

      it("Clean the option when sale is accepted", async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });
        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          buyer
        );
        await marketContract.setOption(buyer, nft, { from: buyer });

        await tokenContract.send(
          marketContract.address,
          1,
          web3.utils.padLeft(web3.utils.toHex(nft), 16),
          { from: buyer }
        );

        expect(await marketContract.hasOption(buyer, nft)).to.be.false;
      });

      it('Clean rate limitation when sale is accepted', async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });
        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          buyer
        );
        await marketContract.setOption(buyer, nft, { from: buyer });
        await marketContract.setOption(buyer, nft, { from: buyer });

        await tokenContract.send(
          marketContract.address,
          1,
          web3.utils.padLeft(web3.utils.toHex(nft), 16),
          { from: buyer }
        );

        await nftContract.approve(marketContract.address, nft, {
          from: buyer,
        });
        await marketContract.createSaleFrom(buyer, nft, 1, {
          from: buyer,
        });
        await marketContract.setOption(buyer, nft, { from: buyer });

        expect(await marketContract.hasOption(buyer, nft)).to.be.true;
      });

      it('Emits OptionSet when an option is set', async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });
        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          buyer
        );
        const transaction = await marketContract.setOption(buyer, nft, { from: buyer });
        const { 1: until } = await marketContract.getOption(nft);

        expect(transaction.logs[0]).to.have.property("event", "OptionSet");
        const event = transaction
          .logs[0] as Truffle.TransactionLog<OptionSet>;
        expect(event.args).to.have.property("tokenId");
        expect(event.args.tokenId.toNumber()).to.equals(1);
        expect(event.args).to.have.property("buyer");
        expect(event.args.buyer).to.equals(buyer);
        expect(event.args).to.have.property("until");
        expect(event.args.until.toString()).to.equals(until.toString());
      });

      it('Emits OptionSet when an option is unset', async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });
        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          buyer
        );
        await marketContract.setOption(buyer, nft, { from: buyer });

        const transaction = await tokenContract.send(
          marketContract.address,
          1,
          web3.utils.padLeft(web3.utils.toHex(nft), 16),
          { from: buyer }
        );

        const [event] = await marketContract.getPastEvents("OptionSet", {
          fromBlock: transaction.receipt.blockNumber,
          toBlock: transaction.receipt.blockNumber,
        });

        expect(event.returnValues).to.have.property("tokenId");
        expect(event.returnValues.tokenId).to.equals("1");
        expect(event.returnValues).to.have.property("buyer");
        expect(event.returnValues.buyer).to.equals(buyer);
        expect(event.returnValues).to.have.property("until");
        expect(event.returnValues.until).to.equals("0");
      });

      it('Clean option after 3 minutes', async () => {
        const snapshotId = (await TimeMachine.takeSnapshot()).result;
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });
        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          buyer
        );
        await marketContract.setOption(buyer, nft, { from: buyer });

        await TimeMachine.advanceTimeAndBlock((60 * 3) - 1);
        expect(await marketContract.hasOption(buyer, nft)).to.be.true;
        await TimeMachine.advanceTimeAndBlock(2);
        expect(await marketContract.hasOption(buyer, nft)).to.be.false;

        await TimeMachine.revertToSnapshot(snapshotId);
      });

      it('Clean rateLimit after 30 minutes', async () => {
        const snapshotId = (await TimeMachine.takeSnapshot()).result;
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.createSaleFrom(seller, nft, 1, {
          from: seller,
        });
        await marketContract.grantRole(
          await marketContract.OPTION_ROLE(),
          buyer
        );
        await marketContract.setOption(buyer, nft, { from: buyer });
        await marketContract.setOption(buyer, nft, { from: buyer });

        await TimeMachine.advanceTimeAndBlock((60 * 30 * 2) - 1);

        try {
          await marketContract.setOption(buyer, nft, { from: buyer });
          assert.fail("setOption did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Rate limit reached");
        }

        await TimeMachine.advanceTimeAndBlock(2);

        expect(await marketContract.hasOption(buyer, nft)).to.be.false;
        await marketContract.setOption(buyer, nft, { from: buyer });
        expect(await marketContract.hasOption(buyer, nft)).to.be.true;

        await TimeMachine.revertToSnapshot(snapshotId);
      });
    })
  });

  describe("as an operator", () => {
    const operator = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];
    let nft: number;
    let nftContract: UltimateChampionsNFTInstance;
    let tokenContract: ChildChampTokenInstance;
    let marketContract: ChampMarketplaceInstance;

    beforeEach(async () => {
      nftContract = await NFT.new();
      tokenContract = await Token.new(accounts[0]);
      marketContract = await NewChampMarketplace(
        tokenContract.address,
        nftContract.address
      );

      // Let's give our buyer some UNA token
      await tokenContract.grantRole(
        await tokenContract.DEPOSITOR_ROLE(),
        operator
      );
      await tokenContract.deposit(
        buyer,
        "0x00000000000000000000000000000000000000000000000000000000000f424075696e74323536"
      );

      // Let's give our seller a NFT
      const { receipt: mintReceipt } = await nftContract.safeMint(
        seller,
        "NFT_1"
      );
      const transferEvent = mintReceipt.logs.find(
        ({ event }) => event === "Transfer"
      );
      nft = transferEvent.args.tokenId.toNumber();

      // operator is the operator of seller NFT
      await nftContract.setApprovalForAll(operator, true, { from: seller });

      // operator is the operator of buyer token
      await tokenContract.authorizeOperator(operator, { from: buyer });
    });

    it('Set an option', async () => {
      await nftContract.approve(marketContract.address, nft, {
        from: seller,
      });
      await marketContract.createSaleFrom(seller, nft, 1, {
        from: seller,
      });
      await marketContract.setOption(buyer, nft, { from: operator });

      expect(await marketContract.hasOption(buyer, nft)).to.be.true;
    });
  });
});
