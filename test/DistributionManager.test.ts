import {
  ChildChampTokenInstance,
  ChildMgcTokenInstance,
  DistributionManagerInstance,
  UltimateChampionsNFTInstance,
} from "../types/truffle-contracts";
import { AllEvents } from "../types/truffle-contracts/DistributionManager";
import TransactionResponse = Truffle.TransactionResponse;

const ChildChamp = artifacts.require("ChildChampToken");
const ChildMgc = artifacts.require("ChildMgcToken");
const UltimateChampionsNFT = artifacts.require("UltimateChampionsNFT");
const DistributionManager = artifacts.require("DistributionManager");

contract("DistributionManager", (accounts) => {
  let champContract: ChildChampTokenInstance;
  let mgcContract: ChildMgcTokenInstance;
  let nfChamp: UltimateChampionsNFTInstance;
  let distributionContract: DistributionManagerInstance;

  const distributor = accounts[0];
  const initialChampBalance = web3.utils.toWei("1000", "ether");
  const nftIds: number[] = [];

  before(async function () {
    champContract = await ChildChamp.new(accounts[0]);
    mgcContract = await ChildMgc.new(accounts[0]);
    nfChamp = await UltimateChampionsNFT.new();
    distributionContract = await DistributionManager.new(
      champContract.address,
      mgcContract.address,
      nfChamp.address
    );
    await champContract.authorizeOperator(distributionContract.address);
    await mgcContract.grantRole(
      await mgcContract.MINT_ROLE(),
      distributionContract.address
    );
    await nfChamp.setApprovalForAll(distributionContract.address, true);

    await champContract.deposit(
      distributor,
      web3.eth.abi.encodeParameter("uint256", initialChampBalance)
    );

    for (let i = 0; i < 2; i++) {
      const { receipt: mintReceipt } = await nfChamp.safeMint(
        distributor,
        `NFT_${i}`
      );
      const transferEvent = mintReceipt.logs.find(
        ({ event }) => event === "Transfer"
      );
      nftIds.push(transferEvent.args.tokenId.toNumber());
    }
  });

  describe("As any user", function () {
    it("Should deny the distribution", async function () {
      try {
        await distributionContract.distribute(
          "ANY_UID",
          accounts[1],
          1,
          1,
          [],
          { from: accounts[2] }
        );
        assert.fail("distribute() did not throw.");
      } catch (e) {
        expect((e as Error).message).to.includes("missing role");
      }
    });
  });

  describe("As a distributor with missing assets", function () {
    describe("When I distribute", function () {
      const UID = "ANY_UID";

      before(async function () {
        try {
          await distributionContract.distribute(UID, accounts[1], 1000, 1000, [
            ...nftIds,
            500, // Not in distributor collection
          ]);
        } catch (_e) {
          // Ignore
        }
      });

      it("Keep my assets intact", async function () {
        expect(
          (await champContract.balanceOf(distributor)).toString(10)
        ).to.equals(initialChampBalance);
        expect((await mgcContract.totalSupply()).toNumber()).to.equals(0);

        for (const nftId of nftIds) {
          expect(await nfChamp.ownerOf(nftId)).to.equals(distributor);
        }
      });

      it("Does not mark as distributed", async function () {
        expect(await distributionContract.isDistributed(UID)).to.be.false;
      });
    });
  });

  describe("As a distributor fully setup", function () {
    const receiver = accounts[1];
    const UID = "VALID_UID";
    const champAmount = web3.utils.toWei("50", "ether");
    const mgcAmount = web3.utils.toWei("100", "ether");

    let distribution: TransactionResponse<AllEvents>;

    before(async function () {
      distribution = await distributionContract.distribute(
        UID,
        receiver,
        champAmount,
        mgcAmount,
        nftIds
      );
    });

    describe("When I distribute", function () {
      it("Distribute all assets", async function () {
        expect(
          (await champContract.balanceOf(receiver)).toString(10)
        ).to.equals(champAmount);
        expect((await mgcContract.balanceOf(receiver)).toString(10)).to.equals(
          mgcAmount
        );

        for (const nftId of nftIds) {
          expect(await nfChamp.ownerOf(nftId)).to.equals(receiver);
        }
      });

      it("Emit Distribute", function () {
        const distributeEvent = distribution.receipt.logs.find(
          ({ event }) => event === "Distribute"
        );
        expect(distributeEvent).to.have.nested.property("args.UID", UID);
      });

      it("Mark as distributed", async function () {
        expect(await distributionContract.isDistributed(UID)).to.be.true;
      });

      it("Deny a duplicate distribution", async function () {
        try {
          await distributionContract.distribute(UID, receiver, 0, 0, []);
          assert.fail("distribute() did not throw.");
        } catch (e) {
          expect((e as Error).message).to.includes("UID must be free");
        }
      });
    });
  });
});
