import {
  TokenTransferRelayInstance,
  UltimateChampionsNFTInstance,
  TestERC20Instance,
} from "../types/truffle-contracts";

const NFT = artifacts.require("UltimateChampionsNFT");
const Token = artifacts.require("TestERC20");
const TokenTransferRelay = artifacts.require("TokenTransferRelay");

contract("TokenTransferRelay", (accounts) => {
  describe("As any user", () => {
    const rootUser = accounts[0];
    const holder = accounts[1];
    const receiver = accounts[2];
    const anyUser = accounts[3];
    const initialTokenBalance = web3.utils.toWei("1000", "ether");
    let nfts: number[];
    let nftContract: UltimateChampionsNFTInstance;
    let tokenContract: TestERC20Instance;
    let tokenTransferRelayContract: TokenTransferRelayInstance;
    const TRANSFER_UID = web3.utils.keccak256("TRANSFER_UID");
    const TRANSFER_UID_2 = web3.utils.keccak256("TRANSFER_UID_2");
    const TRANSFER_UID_3 = web3.utils.keccak256("TRANSFER_UID_3");
    const tokenAmount = 10;

    before(async () => {
      nftContract = await NFT.new(0);
      tokenContract = await Token.new(initialTokenBalance, { from: holder });
      tokenTransferRelayContract = await TokenTransferRelay.new(
        nftContract.address,
        tokenContract.address,
        receiver,
        receiver
      );
      await tokenTransferRelayContract.grantRole(
        await tokenTransferRelayContract.OPERATOR_ROLE(),
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

      await nftContract.setApprovalForAll(
        tokenTransferRelayContract.address,
        true,
        {
          from: holder,
        }
      );
      await tokenContract.approve(
        tokenTransferRelayContract.address,
        initialTokenBalance,
        {
          from: holder,
        }
      );
    });

    it("Should allow me to create a transfer reservation for my ERC20 tokens", async () => {
      try {
        await tokenTransferRelayContract.reserveTransfer(
          TRANSFER_UID,
          [],
          tokenAmount,
          {
            from: holder,
          }
        );
      } catch (err: any) {
        assert.fail("reserveTransfer() threw error: " + err.message);
      }
    });

    it("Should allow me to create a transfer reservation for my ERC721 tokens", async () => {
      try {
        await tokenTransferRelayContract.reserveTransfer(
          TRANSFER_UID_2,
          nfts.slice(0, 2),
          0,
          {
            from: holder,
          }
        );
      } catch (err: any) {
        assert.fail("reserveTransfer() threw error: " + err.message);
      }
    });

    it("Should allow me to create a transfer reservation for my ERC20 and ERC721 tokens, simultaneously", async () => {
      try {
        await tokenTransferRelayContract.reserveTransfer(
          TRANSFER_UID_3,
          nfts.slice(2, 4),
          tokenAmount,
          {
            from: holder,
          }
        );
      } catch (err: any) {
        assert.fail("reserveTransfer() threw error: " + err.message);
      }
    });

    describe("When a token transfer is reserved", () => {
      it("Should mark transfer as reserved", async () => {
        async function validateTransferReservation(
          uid: string,
          tokenIdsLength: number,
          amount: number
        ) {
          expect(
            await tokenTransferRelayContract.isTransferReserved(uid, holder)
          ).to.be.true;
          const transfer = await tokenTransferRelayContract.getTransfer(
            uid,
            holder
          );
          expect(transfer["from"]).to.equals(holder);
          expect(transfer["tokenIds"]).to.have.length(tokenIdsLength);
          expect(transfer["amount"]).to.equals(amount.toString());
          expect(transfer["state"]).to.equals(
            await tokenTransferRelayContract.TRANSFER_RESERVED()
          );
        }

        await Promise.all([
          validateTransferReservation(TRANSFER_UID, 0, tokenAmount),
          validateTransferReservation(TRANSFER_UID_2, 2, 0),
          validateTransferReservation(TRANSFER_UID_3, 2, tokenAmount),
        ]);
      });

      it("Should block me from reserving a transfer for the same UID", async () => {
        async function tryDuplicateTokenReservation(uid: string) {
          try {
            await tokenTransferRelayContract.reserveTransfer(uid, [], 0, {
              from: holder,
            });
            assert.fail("reserveTransfer() did not throw");
          } catch (err: any) {
            expect(err.message).to.includes("already reserved");
          }
        }

        await Promise.all([
          tryDuplicateTokenReservation(TRANSFER_UID),
          tryDuplicateTokenReservation(TRANSFER_UID_2),
          tryDuplicateTokenReservation(TRANSFER_UID_3),
        ]);
      });

      it("Should transfer my ERC20 and ERC721 tokens to escrow", async () => {
        for (let i = 0; i < 4; i++) {
          expect(await nftContract.ownerOf(nfts[i])).to.equals(
            tokenTransferRelayContract.address
          );
        }

        const expectedTokenEscrowAmount = (tokenAmount * 2).toString();
        expect(
          (
            await tokenContract.balanceOf(tokenTransferRelayContract.address)
          ).toString()
        ).to.equals(expectedTokenEscrowAmount);
      });

      it("Should block me from reverting my transfer reservations", async () => {
        async function tryRevertReservation(uid: string) {
          try {
            await tokenTransferRelayContract.revertTransfer(uid, holder, {
              from: holder,
            });
            assert.fail("revertTransfer() did not throw");
          } catch (err: any) {
            expect(err.message).to.includes("missing role");
          }
        }
        await Promise.all([
          tryRevertReservation(TRANSFER_UID),
          tryRevertReservation(TRANSFER_UID_2),
          tryRevertReservation(TRANSFER_UID_3),
        ]);
      });

      it("Should allow me to execute my transfer reservation", async () => {
        async function executeTransfer(uid: string) {
          try {
            await tokenTransferRelayContract.executeTransfer(uid, {
              from: holder,
            });
          } catch (err: any) {
            assert.fail("executeTransfer() threw error: " + err.message);
          }
        }
        await Promise.all([
          executeTransfer(TRANSFER_UID),
          executeTransfer(TRANSFER_UID_2),
          executeTransfer(TRANSFER_UID_3),
        ]);
      });
    });
  });

  describe("As an operator", () => {
    const rootUser = accounts[0];
    const holder = accounts[1];
    const receiver = accounts[2];
    const anyUser = accounts[3];
    const initialTokenBalance = web3.utils.toWei("1000", "ether");
    let nfts: number[];
    let nftContract: UltimateChampionsNFTInstance;
    let tokenContract: TestERC20Instance;
    let tokenTransferRelayContract: TokenTransferRelayInstance;
    const TRANSFER_UID = web3.utils.keccak256("TRANSFER_UID");
    const TRANSFER_UID_2 = web3.utils.keccak256("TRANSFER_UID_2");
    const TRANSFER_UID_3 = web3.utils.keccak256("TRANSFER_UID_3");
    const TRANSFER_UID_4 = web3.utils.keccak256("TRANSFER_UID_4");
    const tokenAmount = 10;

    before(async () => {
      nftContract = await NFT.new(0);
      tokenContract = await Token.new(initialTokenBalance, { from: holder });
      tokenTransferRelayContract = await TokenTransferRelay.new(
        nftContract.address,
        tokenContract.address,
        receiver,
        receiver
      );
      await tokenTransferRelayContract.grantRole(
        await tokenTransferRelayContract.OPERATOR_ROLE(),
        rootUser
      );
      await tokenTransferRelayContract.grantRole(
        await tokenTransferRelayContract.MAINTENANCE_ROLE(),
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

      await nftContract.setApprovalForAll(
        tokenTransferRelayContract.address,
        true,
        {
          from: holder,
        }
      );
      await tokenContract.approve(
        tokenTransferRelayContract.address,
        initialTokenBalance,
        {
          from: holder,
        }
      );
    });

    it("Should allow me to create a transfer reservation for ERC20 tokens, on behalf of the token holder", async () => {
      try {
        await tokenTransferRelayContract.reserveTransferFrom(
          TRANSFER_UID,
          holder,
          [],
          tokenAmount
        );
      } catch (err: any) {
        assert.fail("reserveTransferFrom() threw error: " + err.message);
      }
    });

    it("Should allow me to create a transfer reservation for ERC721 tokens, on behalf of the token holder", async () => {
      try {
        await tokenTransferRelayContract.reserveTransferFrom(
          TRANSFER_UID_2,
          holder,
          nfts.slice(0, 3),
          0
        );
      } catch (err: any) {
        assert.fail("reserveTransferFrom() threw error: " + err.message);
      }
    });

    it("Should allow me to create a transfer reservation for ERC20 and ERC721 tokens, simultaneously, on behalf of the token holder", async () => {
      try {
        await tokenTransferRelayContract.reserveTransferFrom(
          TRANSFER_UID_3,
          holder,
          nfts.slice(3, 6),
          tokenAmount
        );
      } catch (err: any) {
        assert.fail("reserveTransferFrom() threw error: " + err.message);
      }
    });

    describe("When a token transfer is reserved", () => {
      it("Should mark transfer as reserved", async () => {
        async function validateTransferReservation(
          uid: string,
          tokenIdsLength: number,
          amount: number
        ) {
          expect(
            await tokenTransferRelayContract.isTransferReserved(uid, holder)
          ).to.be.true;
          const transfer = await tokenTransferRelayContract.getTransfer(
            uid,
            holder
          );
          expect(transfer["from"]).to.equals(holder);
          expect(transfer["tokenIds"]).to.have.length(tokenIdsLength);
          expect(transfer["amount"]).to.equals(amount.toString());
          expect(transfer["state"]).to.equals(
            await tokenTransferRelayContract.TRANSFER_RESERVED()
          );
        }

        await Promise.all([
          validateTransferReservation(TRANSFER_UID, 0, tokenAmount),
          validateTransferReservation(TRANSFER_UID_2, 3, 0),
          validateTransferReservation(TRANSFER_UID_3, 3, tokenAmount),
        ]);
      });

      it("Should transfer the holders ERC20 and ERC721 tokens to escrow", async () => {
        for (let i = 0; i < nfts.length - 1; i++) {
          expect(await nftContract.ownerOf(nfts[i])).to.equals(
            tokenTransferRelayContract.address
          );
        }

        const expectedTokenEscrowAmount = (tokenAmount * 2).toString();
        expect(
          (
            await tokenContract.balanceOf(tokenTransferRelayContract.address)
          ).toString()
        ).to.equals(expectedTokenEscrowAmount);
      });

      it("Should block duplicate token transfer reservations", async () => {
        async function tryDuplicateTransferReservation(uid: string) {
          try {
            await tokenTransferRelayContract.reserveTransferFrom(
              uid,
              holder,
              [],
              0
            );
            assert.fail("reserveTransferFrom() did not throw");
          } catch (err: any) {
            expect(err.message).to.includes("already reserved");
          }
        }

        await Promise.all([
          tryDuplicateTransferReservation(TRANSFER_UID),
          tryDuplicateTransferReservation(TRANSFER_UID_2),
          tryDuplicateTransferReservation(TRANSFER_UID_3),
        ]);
      });

      it("Should block ERC721 token transfer reservations if `from` is not the token owner", async () => {
        expect(await nftContract.ownerOf(nfts[nfts.length - 1])).to.not.equals(
          anyUser
        );
        try {
          await tokenTransferRelayContract.reserveTransferFrom(
            TRANSFER_UID_4,
            anyUser,
            [nfts[nfts.length - 1]],
            0
          );
          assert.fail("reserveTransfer() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes(
            "ERC721: transfer from incorrect owner"
          );
        }
      });
    });

    describe("When a token transfer is executed", () => {
      before(async () => {
        try {
          await Promise.all([
            tokenTransferRelayContract.executeTransferFrom(
              TRANSFER_UID,
              holder
            ),
            tokenTransferRelayContract.executeTransferFrom(
              TRANSFER_UID_2,
              holder
            ),
            tokenTransferRelayContract.executeTransferFrom(
              TRANSFER_UID_3,
              holder
            ),
          ]);
        } catch (err: any) {
          assert.fail("executeTransferFrom() threw error: " + err.message);
        }
      });

      it("Should mark token transfer as executed", async () => {
        async function validateTransferExecution(uid: string) {
          expect(
            await tokenTransferRelayContract.isTransferProcessed(uid, holder)
          ).to.be.true;
          const { state } = await tokenTransferRelayContract.getTransfer(
            uid,
            holder
          );
          expect(state).to.equals(
            await tokenTransferRelayContract.TRANSFER_EXECUTED()
          );
        }

        await Promise.all([
          validateTransferExecution(TRANSFER_UID),
          validateTransferExecution(TRANSFER_UID_2),
          validateTransferExecution(TRANSFER_UID_3),
        ]);
      });

      it("Should transfer tokens in escrow to ERC20Receiver and ERC721Receiver", async () => {
        for (let i = 0; i < nfts.length - 1; i++) {
          expect(await nftContract.ownerOf(nfts[i])).to.equals(
            await tokenTransferRelayContract.ERC721Receiver()
          );
        }

        const expectedReceiverTokenAmount = (tokenAmount * 2).toString();
        expect(
          (
            await tokenContract.balanceOf(tokenTransferRelayContract.address)
          ).toString()
        ).to.equals("0");
        expect(
          (
            await tokenContract.balanceOf(
              await tokenTransferRelayContract.ERC20Receiver()
            )
          ).toString()
        ).to.equals(expectedReceiverTokenAmount);
      });
    });

    describe("When a token transfer is reverted", () => {
      before(async () => {
        await tokenTransferRelayContract.reserveTransferFrom(
          TRANSFER_UID_4,
          holder,
          [nfts[nfts.length - 1]],
          tokenAmount
        );
        await tokenTransferRelayContract.revertTransfer(TRANSFER_UID_4, holder);
      });

      it("Should mark token transfer as reverted", async () => {
        expect(
          await tokenTransferRelayContract.isTransferProcessed(
            TRANSFER_UID_4,
            holder
          )
        ).to.be.true;
        const { state } = await tokenTransferRelayContract.getTransfer(
          TRANSFER_UID_4,
          holder
        );
        expect(state).to.equals(
          await tokenTransferRelayContract.TRANSFER_REVERTED()
        );
      });

      it("Should transfer the tokens in escrow back to the original holder", async () => {
        expect(await nftContract.ownerOf(nfts[nfts.length - 1])).to.equals(
          holder
        );
        const expectedHolderTokenBalance = "999999999999999999980";
        expect(
          (
            await tokenContract.balanceOf(tokenTransferRelayContract.address)
          ).toString()
        ).to.equals("0");
        expect((await tokenContract.balanceOf(holder)).toString()).to.equals(
          expectedHolderTokenBalance
        );
      });
    });

    describe("When a token transfer is processed", () => {
      it("Should block reservation of the already processed token transfer", async () => {
        async function tryTransferReservation(uid: string) {
          try {
            await tokenTransferRelayContract.reserveTransferFrom(
              uid,
              holder,
              [],
              0
            );
            assert.fail("reserveTransfer() did not throw.");
          } catch (e: any) {
            expect(e.message).to.includes("already processed");
          }
        }

        await Promise.all([
          tryTransferReservation(TRANSFER_UID),
          tryTransferReservation(TRANSFER_UID_2),
          tryTransferReservation(TRANSFER_UID_3),
          tryTransferReservation(TRANSFER_UID_4),
        ]);
      });

      it("Should block execution of the already processed token transfer", async () => {
        async function tryTransferExecute(uid: string) {
          try {
            await tokenTransferRelayContract.executeTransferFrom(uid, holder);
            assert.fail("executeTransferFrom() did not throw.");
          } catch (e: any) {
            expect(e.message).to.includes("Transfer is not reserved");
          }
        }

        await Promise.all([
          tryTransferExecute(TRANSFER_UID),
          tryTransferExecute(TRANSFER_UID_2),
          tryTransferExecute(TRANSFER_UID_3),
          tryTransferExecute(TRANSFER_UID_4),
        ]);
      });

      it("Should block revert of the already processed token transfer", async () => {
        async function tryTransferRevert(uid: string) {
          try {
            await tokenTransferRelayContract.revertTransfer(uid, holder);
            assert.fail("revertTransfer() did not throw.");
          } catch (e: any) {
            expect(e.message).to.includes("Transfer is not reserved");
          }
        }

        await Promise.all([
          tryTransferRevert(TRANSFER_UID),
          tryTransferRevert(TRANSFER_UID_2),
          tryTransferRevert(TRANSFER_UID_3),
          tryTransferRevert(TRANSFER_UID_4),
        ]);
      });
    });
  });
});
