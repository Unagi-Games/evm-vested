import {
  ChampMarketplaceInstance,
  ChildChampTokenInstance,
  UltimateChampionsNFTInstance,
} from "../types/truffle-contracts";
import { NewChampMarketplace } from "./ChampMarketplace.service";

const NFT = artifacts.require("UltimateChampionsNFT");
const Token = artifacts.require("ChildChampToken");

const ZeroAddress = "0x0000000000000000000000000000000000000000";

contract("Marketplace", (accounts) => {
  describe("as a user", () => {
    const rootUser = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];
    let nft: number;
    let nftContract: UltimateChampionsNFTInstance;
    let tokenContract: ChildChampTokenInstance;
    let marketContract: ChampMarketplaceInstance;

    before(async () => {
      nftContract = await NFT.new(0);
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

    describe("E2E ERC20", () => {
      it("Should allow users to exchange NFT", async () => {
        const SALE_PRICE = 100;
        const initialSellerBalance = (
          await tokenContract.balanceOf(seller)
        ).toNumber();
        const initialBuyerBalance = (
          await tokenContract.balanceOf(buyer)
        ).toNumber();

        // Check initial state
        expect(await nftContract.ownerOf(nft)).to.equals(seller);

        // Create the sale
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        const { receipt: createSaleReceipt } = await marketContract.methods[
          "createSaleFrom(address,uint64,uint256)"
        ](seller, nft, SALE_PRICE, {
          from: seller,
        });
        const createSaleEvent = createSaleReceipt.logs.find(
          ({ event }) => event === "SaleCreated"
        );
        expect(createSaleEvent.args.seller).to.equals(seller);
        expect(createSaleEvent.args.tokenId.toNumber()).to.equals(nft);
        expect(createSaleEvent.args.tokenWeiPrice.toNumber()).to.equals(
          SALE_PRICE
        );

        // Accept the sale
        await tokenContract.approve(marketContract.address, SALE_PRICE, {
          from: buyer,
        });
        await marketContract.methods["acceptSale(uint64,uint256)"](
          nft,
          SALE_PRICE,
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
        expect((await tokenContract.balanceOf(seller)).toNumber()).to.equals(
          initialSellerBalance + SALE_PRICE
        );
        expect((await tokenContract.balanceOf(buyer)).toNumber()).to.equals(
          initialBuyerBalance - SALE_PRICE
        );
      });

      it("Should allow to buy a NFT for someone else", async () => {
        const receiver = accounts[5];
        const SALE_PRICE = 100;
        const initialSellerBalance = (
          await tokenContract.balanceOf(seller)
        ).toNumber();
        const initialBuyerBalance = (
          await tokenContract.balanceOf(buyer)
        ).toNumber();

        // Create the sale
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          SALE_PRICE,
          {
            from: seller,
          }
        );

        // Accept the sale
        await tokenContract.approve(marketContract.address, SALE_PRICE, {
          from: buyer,
        });
        await marketContract.methods["acceptSale(uint64,uint256,address)"](
          nft,
          SALE_PRICE,
          receiver,
          { from: buyer }
        );

        // Check final state
        expect(await nftContract.ownerOf(nft)).to.equals(receiver);
        expect((await tokenContract.balanceOf(seller)).toNumber()).to.equals(
          initialSellerBalance + SALE_PRICE
        );
        expect((await tokenContract.balanceOf(buyer)).toNumber()).to.equals(
          initialBuyerBalance - SALE_PRICE
        );
      });
    });

    describe("Sale creation", () => {
      it("Should require market to be approve by nft owner", async () => {
        try {
          await marketContract.methods[
            "createSaleFrom(address,uint64,uint256)"
          ](seller, nft, 1, { from: seller });
          assert.fail("createSaleFrom() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes(
            "Contract should be approved by the token owner"
          );
        }
      });

      it("Should require seller to be the nft owner", async () => {
        const notOwner = accounts[5];
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        try {
          await marketContract.methods[
            "createSaleFrom(address,uint64,uint256)"
          ](notOwner, nft, 1, {
            from: notOwner,
          });
          assert.fail("createSaleFrom() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Create sale of token that is not own");
        }
      });

      it("Should require sale sender to be approved", async () => {
        const notOwner = accounts[5];
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        try {
          await marketContract.methods[
            "createSaleFrom(address,uint64,uint256)"
          ](seller, nft, 1, {
            from: notOwner,
          });
          assert.fail("createSaleFrom() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes(
            "Only the token owner or its operator are allowed to create a sale"
          );
        }
      });

      it("Should require a positive price", async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        try {
          await marketContract.methods[
            "createSaleFrom(address,uint64,uint256)"
          ](seller, nft, -1, {
            from: seller,
          });
          assert.fail("createSaleFrom() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("value out-of-bounds");
        }

        try {
          await marketContract.methods[
            "createSaleFrom(address,uint64,uint256)"
          ](seller, nft, 0, { from: seller });
          assert.fail("createSaleFrom() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Price should be strictly positive");
        }
      });

      it("Should allow to set a reserved offer on the sale", async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        const { receipt: createSaleReceipt } = await marketContract.methods[
          "createSaleFrom(address,uint64,uint256,address)"
        ](seller, nft, 100, buyer, {
          from: seller,
        });

        const createSaleEvent = createSaleReceipt.logs.find(
          ({ event }) => event === "SaleCreated"
        );
        expect(createSaleEvent.args.reserve).to.equals(buyer);

        const hasReservedOffer = await marketContract.hasReservedOffer(
          buyer,
          nft
        );
        const { 1: reservedOffer } = await marketContract.getSale(nft);

        expect(hasReservedOffer).to.be.true;
        expect(reservedOffer).to.be.equal(buyer);
      });
    });

    describe("Sale edition", () => {
      it("Should edit sale", async () => {
        const INITIAL_SALE_PRICE = 1;
        const NEW_SALE_PRICE = 100;
        const reservedAddress = accounts[5];

        // Create the sale
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          INITIAL_SALE_PRICE,
          {
            from: seller,
          }
        );

        await marketContract.updateSaleFrom(
          seller,
          nft,
          NEW_SALE_PRICE,
          reservedAddress,
          {
            from: seller,
          }
        );

        await tokenContract.approve(marketContract.address, NEW_SALE_PRICE, {
          from: buyer,
        });

        try {
          await marketContract.methods["acceptSale(uint64,uint256)"](
            nft,
            INITIAL_SALE_PRICE,
            { from: buyer }
          );
          assert.fail("Accept the sale did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Sale price does not match");
        }

        try {
          await marketContract.methods["acceptSale(uint64,uint256)"](
            nft,
            NEW_SALE_PRICE,
            { from: buyer }
          );
          assert.fail("Accept the sale did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("A reservation exists for this sale");
        }
      });

      it("Should emit SaleUpdated event", async () => {
        const NEW_SALE_PRICE = 100;
        const reservedAddress = accounts[5];

        // Create the sale
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          1,
          {
            from: seller,
          }
        );

        const { receipt: updateSaleReceipt } =
          await marketContract.updateSaleFrom(
            seller,
            nft,
            NEW_SALE_PRICE,
            reservedAddress,
            {
              from: seller,
            }
          );
        const updateSaleEvent = updateSaleReceipt.logs.find(
          ({ event }) => event === "SaleUpdated"
        );
        expect(updateSaleEvent.args.seller).to.equals(seller);
        expect(updateSaleEvent.args.tokenId.toNumber()).to.equals(nft);
        expect(updateSaleEvent.args.tokenWeiPrice.toNumber()).to.equals(
          NEW_SALE_PRICE
        );
        expect(updateSaleEvent.args.reserve).to.equals(reservedAddress);
      });

      it("Should require user to be the nft owner", async () => {
        // Create the sale
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          1,
          {
            from: seller,
          }
        );

        const notOwner = accounts[5];
        try {
          await marketContract.updateSaleFrom(notOwner, nft, 2, ZeroAddress, {
            from: notOwner,
          });
          assert.fail("updateSaleFrom() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Update sale of token that is not own");
        }
      });

      it("Should require a positive price", async () => {
        // Create the sale
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          1,
          {
            from: seller,
          }
        );

        try {
          await marketContract.updateSaleFrom(seller, nft, -1, ZeroAddress, {
            from: seller,
          });
          assert.fail("updateSaleFrom() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("value out-of-bounds");
        }

        try {
          await marketContract.updateSaleFrom(seller, nft, 0, ZeroAddress, {
            from: seller,
          });
          assert.fail("createSaleFrom() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Price should be strictly positive");
        }
      });
    });

    describe("Sale accept", () => {
      describe("ERC20", () => {
        it("Should require allowance to be greater than buyer sale price", async () => {
          const SALE_PRICE = 100;
          await nftContract.approve(marketContract.address, nft, {
            from: seller,
          });
          await marketContract.setMarketplacePercentFees(0, 5, 0);
          await marketContract.methods[
            "createSaleFrom(address,uint64,uint256)"
          ](seller, nft, SALE_PRICE, {
            from: seller,
          });
          try {
            const buyerPrice = await marketContract.getBuyerSalePrice(nft);
            await tokenContract.approve(
              marketContract.address,
              buyerPrice.toNumber() - 1,
              {
                from: buyer,
              }
            );
            await marketContract.methods["acceptSale(uint64,uint256)"](
              nft,
              SALE_PRICE,
              { from: buyer }
            );
            assert.fail("Accept the sale did not throw.");
          } catch (e: any) {
            expect(e.message).to.includes(
              "Allowance is lower than buyer sale price"
            );
          }
        });

        it("Should require the sale to have an open reservation for buyer", async () => {
          const SALE_PRICE = 100;
          const reservedAddress = accounts[5];
          await nftContract.approve(marketContract.address, nft, {
            from: seller,
          });
          await marketContract.methods[
            "createSaleFrom(address,uint64,uint256,address)"
          ](seller, nft, SALE_PRICE, reservedAddress, {
            from: seller,
          });

          const isReservationOpenForBuyer =
            await marketContract.isReservationOpenFor(buyer, nft);
          const isReservationOpenForReservedAddr =
            await marketContract.isReservationOpenFor(reservedAddress, nft);

          expect(isReservationOpenForBuyer).to.be.false;
          expect(isReservationOpenForReservedAddr).to.be.true;

          try {
            await tokenContract.approve(marketContract.address, SALE_PRICE, {
              from: buyer,
            });
            await marketContract.methods["acceptSale(uint64,uint256)"](
              nft,
              SALE_PRICE,
              { from: buyer }
            );
            assert.fail("Accept the sale did not throw.");
          } catch (e: any) {
            expect(e.message).to.includes("A reservation exists for this sale");
          }
        });
      });
    });

    describe("Sale destroy", () => {
      it("Should emit SaleDestroyed event", async () => {
        const SALE_PRICE = 100;
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          SALE_PRICE,
          {
            from: seller,
          }
        );
        const { receipt: destroySaleReceipt } =
          await marketContract.destroySaleFrom(seller, nft, { from: seller });
        const saleDestroyedEvent = destroySaleReceipt.logs.find(
          ({ event }) => event === "SaleDestroyed"
        );
        expect(saleDestroyedEvent.args.tokenId.toNumber()).to.equals(nft);
      });

      it("Should require destroy from to be the token owner", async () => {
        const anyAccount = accounts[5];
        const SALE_PRICE = 100;
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          SALE_PRICE,
          {
            from: seller,
          }
        );

        try {
          await marketContract.destroySaleFrom(anyAccount, nft, {
            from: anyAccount,
          });
          assert.fail("destroySaleFrom() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes(
            "Destroy sale of token that is not own"
          );
        }
      });

      it("Should require destroy sender to be approve", async () => {
        const anyAccount = accounts[5];
        const SALE_PRICE = 100;
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          SALE_PRICE,
          {
            from: seller,
          }
        );

        try {
          await marketContract.destroySaleFrom(seller, nft, {
            from: anyAccount,
          });
          assert.fail("destroySaleFrom() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes(
            "Only the token owner or its operator are allowed to destroy a sale"
          );
        }
      });

      it("Should deny sell if seller destroyed sale", async () => {
        const SALE_PRICE = 100;
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          SALE_PRICE,
          {
            from: seller,
          }
        );
        await marketContract.destroySaleFrom(seller, nft, { from: seller });

        await tokenContract.approve(marketContract.address, SALE_PRICE, {
          from: buyer,
        });
        try {
          await marketContract.methods["acceptSale(uint64,uint256)"](
            nft,
            SALE_PRICE,
            { from: buyer }
          );
          assert.fail("Accept the sale did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("Sale does not exists");
        }
      });
    });

    describe("Sale getter", () => {
      it("Should require allowance to be greater than buyer sale price", async () => {
        const SALE_PRICE = 100;
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.setMarketplacePercentFees(0, 5, 0);
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          SALE_PRICE,
          {
            from: seller,
          }
        );
        try {
          const buyerPrice = await marketContract.getBuyerSalePrice(nft);
          await tokenContract.approve(
            marketContract.address,
            buyerPrice.toNumber() - 1,
            {
              from: buyer,
            }
          );
          await marketContract.methods["acceptSale(uint64,uint256)"](
            nft,
            SALE_PRICE,
            { from: buyer }
          );
          assert.fail("Accept the sale did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes(
            "Allowance is lower than buyer sale price"
          );
        }
      });

      it("Should return 0s for NFT not on sale", async () => {
        expect((await marketContract.getSale(nft))[0].toNumber()).to.equals(0);
        expect(
          (await marketContract.getBuyerSalePrice(nft)).toNumber()
        ).to.equals(0);
      });

      it("Should return 0s for NFT on sale but not approved", async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          "1",
          {
            from: seller,
          }
        );
        await nftContract.approve(
          "0x0000000000000000000000000000000000000000",
          nft,
          { from: seller }
        );

        expect((await marketContract.getSale(nft))[0].toNumber()).to.equals(0);
        expect(
          (await marketContract.getBuyerSalePrice(nft)).toNumber()
        ).to.equals(0);
      });

      it("Should return true for on sale NFT", async () => {
        const SALE_PRICE = 100;
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          SALE_PRICE,
          {
            from: seller,
          }
        );

        expect(await marketContract.hasSale(nft)).to.be.true;
      });

      it("Should returns false for NFT not on sale", async () => {
        expect(await marketContract.hasSale(nft)).to.be.false;
      });

      it("Should returns false for NFT on sale but not approved", async () => {
        await nftContract.approve(marketContract.address, nft, {
          from: seller,
        });
        await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
          seller,
          nft,
          "1",
          {
            from: seller,
          }
        );
        await nftContract.approve(
          "0x0000000000000000000000000000000000000000",
          nft,
          { from: seller }
        );

        expect(await marketContract.hasSale(nft)).to.be.false;
      });
    });
  });

  describe("as an operator", () => {
    const operator = accounts[0];
    const seller = accounts[1];
    const buyer = accounts[2];
    let nft: number;
    let nftContract: UltimateChampionsNFTInstance;
    let tokenContract: ChildChampTokenInstance;
    let marketContract: ChampMarketplaceInstance;

    before(async () => {
      nftContract = await NFT.new(0);
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
        operator,
        "0x00000000000000000000000000000000000000000000000000000000000f424075696e74323536"
      );
      await tokenContract.deposit(
        buyer,
        "0x00000000000000000000000000000000000000000000000000000000000f424075696e74323536"
      );

      // operator is the operator of seller NFT
      await nftContract.setApprovalForAll(operator, true, { from: seller });
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

    describe("E2E", () => {
      it("Should allow users to exchange NFT", async () => {
        const SALE_PRICE = 100;
        const initialSellerBalance = (
          await tokenContract.balanceOf(seller)
        ).toNumber();

        // Check initial state
        expect(await nftContract.ownerOf(nft)).to.equals(seller);

        // Create the sale
        await nftContract.approve(marketContract.address, nft, {
          from: operator,
        });
        const { receipt: createSaleReceipt } = await marketContract.methods[
          "createSaleFrom(address,uint64,uint256)"
        ](seller, nft, SALE_PRICE, {
          from: operator,
        });
        const createSaleEvent = createSaleReceipt.logs.find(
          ({ event }) => event === "SaleCreated"
        );
        expect(createSaleEvent.args.seller).to.equals(seller);
        expect(createSaleEvent.args.tokenId.toNumber()).to.equals(nft);
        expect(createSaleEvent.args.tokenWeiPrice.toNumber()).to.equals(
          SALE_PRICE
        );

        // Accept the sale
        await tokenContract.approve(marketContract.address, SALE_PRICE, {
          from: operator,
        });
        await marketContract.methods["acceptSale(uint64,uint256,address)"](
          nft,
          SALE_PRICE,
          buyer,
          { from: operator }
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
        expect(
          await nftContract.ownerOf(nft),
          "Owner of NFT is buyer"
        ).to.equals(buyer);
        expect(await nftContract.getApproved(nft)).to.equals(
          "0x0000000000000000000000000000000000000000"
        );
        expect((await tokenContract.balanceOf(seller)).toNumber()).to.equals(
          initialSellerBalance + SALE_PRICE
        );
      });
    });

    it("Update sale", async () => {
      const INITIAL_SALE_PRICE = 1;
      const NEW_SALE_PRICE = 100;
      const reservedAddress = accounts[5];

      await nftContract.approve(marketContract.address, nft, {
        from: operator,
      });
      await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
        seller,
        nft,
        INITIAL_SALE_PRICE,
        {
          from: operator,
        }
      );
      const { receipt: updateSaleReceipt } =
        await marketContract.updateSaleFrom(
          seller,
          nft,
          NEW_SALE_PRICE,
          reservedAddress,
          {
            from: operator,
          }
        );
      const saleUpdatedEvent = updateSaleReceipt.logs.find(
        ({ event }) => event === "SaleUpdated"
      );
      expect(saleUpdatedEvent.args.tokenId.toNumber()).to.equals(nft);
      expect(saleUpdatedEvent.args.tokenWeiPrice.toNumber()).to.equals(
        NEW_SALE_PRICE
      );
      expect(saleUpdatedEvent.args.reserve).to.equals(reservedAddress);

      await tokenContract.approve(marketContract.address, NEW_SALE_PRICE, {
        from: buyer,
      });

      // Try to buy at initial price should throw
      try {
        await marketContract.methods["acceptSale(uint64,uint256)"](
          nft,
          INITIAL_SALE_PRICE,
          { from: buyer }
        );
        assert.fail("Accept the sale did not throw.");
      } catch (e: any) {
        expect(e.message).to.includes("Sale price does not match");
      }
      // Try to buy with account other than `reservedAddress` should throw
      try {
        await marketContract.methods["acceptSale(uint64,uint256)"](
          nft,
          NEW_SALE_PRICE,
          { from: buyer }
        );
        assert.fail("Accept the sale did not throw.");
      } catch (e: any) {
        expect(e.message).to.includes("A reservation exists for this sale");
      }
    });

    it("Destroy sale", async () => {
      const SALE_PRICE = 100;

      await nftContract.approve(marketContract.address, nft, {
        from: operator,
      });
      await marketContract.methods["createSaleFrom(address,uint64,uint256)"](
        seller,
        nft,
        SALE_PRICE,
        {
          from: operator,
        }
      );
      const { receipt: destroySaleReceipt } =
        await marketContract.destroySaleFrom(seller, nft, { from: operator });
      const saleDestroyedEvent = destroySaleReceipt.logs.find(
        ({ event }) => event === "SaleDestroyed"
      );
      expect(saleDestroyedEvent.args.tokenId.toNumber()).to.equals(nft);
    });
  });
});
