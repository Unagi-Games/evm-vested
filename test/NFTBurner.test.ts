import {
  NFTBurnerInstance,
  UltimateChampionsNFTInstance,
} from "../types/truffle-contracts";

const NFT = artifacts.require("UltimateChampionsNFT");
const Burner = artifacts.require("NFTBurner");

contract.only("NFT Burner", (accounts) => {
  describe("As any user", () => {
    const rootUser = accounts[0];
    const holder = accounts[1];
    const anyUser = accounts[2];
    let nfts: number[];
    let nftContract: UltimateChampionsNFTInstance;
    let burnerContract: NFTBurnerInstance;
    const BURN_UID = web3.utils.keccak256("BURN_UID");

    before(async () => {
      nftContract = await NFT.new(0);
      burnerContract = await Burner.new(nftContract.address);
      await burnerContract.grantRole(
        await burnerContract.OPERATOR_ROLE(),
        rootUser
      );

      // Let's give our holder some NFTs
      const receipts = await Promise.all([
        nftContract.safeMint(holder, "NFT_1"),
        nftContract.safeMint(holder, "NFT_2"),
        nftContract.safeMint(holder, "NFT_3"),
        nftContract.safeMint(holder, "NFT_4"),
        nftContract.safeMint(holder, "NFT_5"),
        nftContract.safeMint(holder, "NFT_6"),
        nftContract.safeMint(holder, "NFT_7"),
      ]);
      nfts = receipts.map(({ receipt }) =>
        receipt.logs
          .find(({ event }) => event === "Transfer")
          .args.tokenId.toNumber()
      );

      await nftContract.setApprovalForAll(burnerContract.address, true, {
        from: holder,
      });
    });

    it("Should block me from creatign a token burn reservation", async () => {
      try {
        await burnerContract.reserveBurn(BURN_UID, holder, nfts, {
          from: anyUser,
        });
      } catch (e: any) {
        expect(e.message).to.includes("missing role");
      }
    });

    it("Should block me from executing a burn reservation", async () => {
      await burnerContract.reserveBurn(BURN_UID, holder, nfts);
      try {
        await burnerContract.executeBurn(BURN_UID, {
          from: anyUser,
        });
      } catch (e: any) {
        expect(e.message).to.includes("missing role");
      }
    });

    it("Should block me from reverting a burn reservation", async () => {
      try {
        await burnerContract.revertBurn(BURN_UID, {
          from: anyUser,
        });
      } catch (e: any) {
        expect(e.message).to.includes("missing role");
      }
    });
  });

  describe("As an operator", () => {
    const rootUser = accounts[0];
    const holder = accounts[1];
    const anyUser = accounts[2];
    let nfts: number[];
    let nftContract: UltimateChampionsNFTInstance;
    let burnerContract: NFTBurnerInstance;
    const BURN_UID = web3.utils.keccak256("BURN_UID");
    const BURN_UID_2 = web3.utils.keccak256("BURN_UID_2");

    before(async () => {
      nftContract = await NFT.new(0);
      burnerContract = await Burner.new(nftContract.address);
      await burnerContract.grantRole(
        await burnerContract.OPERATOR_ROLE(),
        rootUser
      );

      // Let's give our holder some NFTs
      const receipts = await Promise.all([
        nftContract.safeMint(holder, "NFT_1"),
        nftContract.safeMint(holder, "NFT_2"),
        nftContract.safeMint(holder, "NFT_3"),
        nftContract.safeMint(holder, "NFT_4"),
        nftContract.safeMint(holder, "NFT_5"),
        nftContract.safeMint(holder, "NFT_6"),
        nftContract.safeMint(holder, "NFT_7"),
      ]);
      nfts = receipts.map(({ receipt }) =>
        receipt.logs
          .find(({ event }) => event === "Transfer")
          .args.tokenId.toNumber()
      );

      await nftContract.setApprovalForAll(burnerContract.address, true, {
        from: holder,
      });
    });

    describe("When a token burn is reserved", () => {
      before(async () => {
        // Assert initial state
        expect(await nftContract.ownerOf(nfts[0])).to.equals(holder);
        expect(await nftContract.ownerOf(nfts[1])).to.equals(holder);
        expect(await nftContract.ownerOf(nfts[2])).to.equals(holder);

        await burnerContract.reserveBurn(BURN_UID, holder, nfts.slice(0, 3));
      });

      it("Should set token burn state as reserved", async () => {
        const burn = await burnerContract.getBurn(BURN_UID);
        expect(burn["from"]).to.equals(holder);
        expect(burn["tokenIds"]).to.have.length(3);
        expect(burn["state"]).to.equals(await burnerContract.BURN_RESERVED());
      });

      it("Should only accept token burn reservations for 1, or more tokens", async () => {
        try {
          await burnerContract.reserveBurn(BURN_UID_2, holder, []);
        } catch (e: any) {
          expect(e.message).to.includes(
            "burn must be reserved for at least 1 token"
          );
        }
      });

      it("Should transfer the holder's NFTs to escrow", async () => {
        expect(await nftContract.ownerOf(nfts[0])).to.equals(
          burnerContract.address
        );
        expect(await nftContract.ownerOf(nfts[1])).to.equals(
          burnerContract.address
        );
        expect(await nftContract.ownerOf(nfts[2])).to.equals(
          burnerContract.address
        );
      });

      it("Should block token reservations for the same UID", async () => {
        try {
          await burnerContract.reserveBurn(BURN_UID, holder, nfts);
        } catch (e: any) {
          expect(e.message).to.includes("already reserved");
        }
      });

      it("Should block token reservations if `from` is not NFT's owner", async () => {
        expect(await nftContract.ownerOf(nfts[0])).to.not.equals(anyUser);
        try {
          await burnerContract.reserveBurn(BURN_UID_2, anyUser, nfts);
        } catch (e: any) {
          expect(e.message).to.includes(
            "ERC721: transfer from incorrect owner"
          );
        }
      });
    });

    describe("When a token burn is executed", () => {
      const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

      before(async () => {
        // Assert initial state
        expect(await nftContract.ownerOf(nfts[0])).to.equals(
          burnerContract.address
        );
        expect(await nftContract.ownerOf(nfts[1])).to.equals(
          burnerContract.address
        );
        expect(await nftContract.ownerOf(nfts[2])).to.equals(
          burnerContract.address
        );

        await burnerContract.executeBurn(BURN_UID);
      });

      it("Should set token burn state as executed", async () => {
        const burn = await burnerContract.getBurn(BURN_UID);
        expect(burn["state"]).to.equals(await burnerContract.BURN_EXECUTED());
      });

      it("Should transfer the NFTs in escrow to DEAD address", async () => {
        expect(await nftContract.ownerOf(nfts[0])).to.equals(DEAD_ADDRESS);
        expect(await nftContract.ownerOf(nfts[1])).to.equals(DEAD_ADDRESS);
        expect(await nftContract.ownerOf(nfts[2])).to.equals(DEAD_ADDRESS);
      });

      it("Should block duplicate burn execution for the same UID", async () => {
        try {
          await burnerContract.executeBurn(BURN_UID);
        } catch (e: any) {
          expect(e.message).to.includes("Burn must be reserved");
        }
      });
    });

    describe("When a token burn is reverted", () => {
      before(async () => {
        // Assert initial state
        expect(await nftContract.ownerOf(nfts[3])).to.equals(holder);
        expect(await nftContract.ownerOf(nfts[4])).to.equals(holder);
        expect(await nftContract.ownerOf(nfts[5])).to.equals(holder);
        expect(await nftContract.ownerOf(nfts[6])).to.equals(holder);

        await burnerContract.reserveBurn(BURN_UID_2, holder, nfts.slice(3));
        await burnerContract.revertBurn(BURN_UID_2);
      });

      it("Should set token burn state as reverted", async () => {
        const burn = await burnerContract.getBurn(BURN_UID_2);
        expect(burn["state"]).to.equals(await burnerContract.BURN_REVERTED());
      });

      it("Should transfer the NFTs in escrow back to the original holder", async () => {
        expect(await nftContract.ownerOf(nfts[3])).to.equals(holder);
        expect(await nftContract.ownerOf(nfts[4])).to.equals(holder);
        expect(await nftContract.ownerOf(nfts[5])).to.equals(holder);
        expect(await nftContract.ownerOf(nfts[6])).to.equals(holder);
      });

      it("Should block duplicate burn revert for the same UID", async () => {
        try {
          await burnerContract.revertBurn(BURN_UID_2);
        } catch (e: any) {
          expect(e.message).to.includes("Burn must be reserved");
        }
      });
    });
  });
});
