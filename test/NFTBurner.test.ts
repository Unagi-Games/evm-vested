import {
    NFTBurnerInstance,
    UltimateChampionsNFTInstance,
  } from "../types/truffle-contracts";
  
  const NFT = artifacts.require("UltimateChampionsNFT");
  const Burner = artifacts.require("NFTBurner");
  
  contract.only("NFT Burner", (accounts) => {
    describe("as an operator", () => {
      const rootUser = accounts[0];
      const holder = accounts[1];
      const randomUser = accounts[2];
      let nfts: number[];
      let nftContract: UltimateChampionsNFTInstance;
      let burnerContract: NFTBurnerInstance;
  
      before(async () => {
        nftContract = await NFT.new(0);
        burnerContract = await Burner.new(nftContract.address);
        await burnerContract.grantRole(await burnerContract.OPERATOR_ROLE(), rootUser);
      });
  
      beforeEach(async () => {
        // Let's give our seller a NFT
        const [
            { receipt: mintReceipt1 },
            { receipt: mintReceipt2 },
            { receipt: mintReceipt3 }
        ] = await Promise.all([
            nftContract.safeMint(holder, "NFT_1"),  
            nftContract.safeMint(holder, "NFT_2"),  
            nftContract.safeMint(holder, "NFT_3"),  
        ]);
        const find = ({ event }) => event === "Transfer";
        nfts = [
            mintReceipt1.logs.find(find).args.tokenId.toNumber(),
            mintReceipt2.logs.find(find).args.tokenId.toNumber(),
            mintReceipt3.logs.find(find).args.tokenId.toNumber(),
        ]

        console.log('NFTs', nfts)
      });
      
      describe("When a token burn is reserved", () => {
        const BURN_UID = web3.utils.keccak256("PAYMENT_UID");

        it("Should place the holder's NFTs under escrow", async () => {
					// Check initial state
					expect(await nftContract.ownerOf(nfts[0])).to.equals(holder);
					await nftContract.setApprovalForAll(burnerContract.address, true, {
						from: holder,
					});
					await burnerContract.reserveBurn(BURN_UID, holder, nfts);

					expect(await nftContract.ownerOf(nfts[0])).to.equals(burnerContract.address);
					expect(await nftContract.ownerOf(nfts[1])).to.equals(burnerContract.address);
					expect(await nftContract.ownerOf(nfts[2])).to.equals(burnerContract.address);
        });

        it("Should block non-authorized operator from making a burn reservation", async () => {
            // Check initial state
            expect(await nftContract.ownerOf(nfts[0])).to.equals(holder);
            await nftContract.setApprovalForAll(burnerContract.address, true, {
							from: holder,
            });
            
            try {
							await burnerContract.reserveBurn(BURN_UID, holder, nfts, {
								from: randomUser,
							});
            } catch (e: any) {
							expect(e.message).to.includes("missing role");
            }
        });
      });
    });
  });