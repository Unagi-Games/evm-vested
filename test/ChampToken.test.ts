import { ChampTokenInstance } from "../types/truffle-contracts";

const ChampToken = artifacts.require("ChampToken");

contract("ChampToken", (accounts) => {
  let contract: ChampTokenInstance;
  const rootUser = accounts[0];
  const anyUser = accounts[1];

  beforeEach(async () => {
    contract = await ChampToken.new(
      [rootUser],
      [web3.utils.toWei("1000000000", "ether")]
    );
  });

  it("Transfer tokens", async () => {
    await contract.transfer(anyUser, 100);
    expect((await contract.balanceOf(anyUser)).toNumber()).to.equals(100);
  });

  it("Pause transfer", async () => {
    await contract.pause();

    try {
      await contract.transfer(anyUser, 100);
      assert.fail("transfer() did not throw.");
    } catch (e) {
      expect((e as Error).message).to.includes("Pausable: paused");
    }
  });

  it("Requires PAUSER_ROLE to pause", async () => {
    await contract.renounceRole(await contract.PAUSER_ROLE(), rootUser);

    try {
      await contract.pause();
      assert.fail("pause() did not throw.");
    } catch (e) {
      expect((e as Error).message).to.includes("missing role");
    }
  });

  it("Requires PAUSER_ROLE to unpause", async () => {
    await contract.pause();
    await contract.renounceRole(await contract.PAUSER_ROLE(), rootUser);

    try {
      await contract.unpause();
      assert.fail("unpause() did not throw.");
    } catch (e) {
      expect((e as Error).message).to.includes("missing role");
    }
  });
});
