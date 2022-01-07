import TimeMachine from "ganache-time-traveler";
import { TestLockableInstance } from "../types/truffle-contracts";
import {
  PermanentlyLocked,
  Locked,
} from "../types/truffle-contracts/TestLockable";

const Lockable = artifacts.require("TestLockable");

contract("Lockable", (accounts) => {
  let contract: TestLockableInstance;

  beforeEach(async () => {
    contract = await Lockable.new();
  });

  it("Initial state is unlock", async () => {
    expect(await contract.locked()).to.be.false;
  });

  describe("Time dependant tests", () => {
    let snapshotId: string;

    beforeEach(async () => {
      snapshotId = (await TimeMachine.takeSnapshot()).result;
    });

    afterEach(async () => {
      await TimeMachine.revertToSnapshot(snapshotId);
    });

    it("Sets temporary lock", async () => {
      const DURATION = 3600;

      await contract.lock(DURATION);
      expect(await contract.locked()).to.be.true;
      await TimeMachine.advanceTimeAndBlock(DURATION - 1);
      expect(await contract.locked()).to.be.true;
      await TimeMachine.advanceTimeAndBlock(1);
      expect(await contract.locked()).to.be.false;
    });
  });

  it("Sets permanent lock", async () => {
    await contract.permanentLock();
    expect(await contract.locked()).to.be.true;
  });

  it("Reverts if locked", async () => {
    await contract.permanentLock();

    try {
      await contract.doWhenNotLocked();
      assert.fail("doWhenNotLocked() did not throw.");
    } catch (e) {
      expect((e as Error).message).to.includes("Lockable: locked");
    }
  });

  it("Reverts if not locked", async () => {
    try {
      await contract.doWhenLocked();
      assert.fail("doWhenLocked() did not throw.");
    } catch (e) {
      expect((e as Error).message).to.includes("Lockable: not locked");
    }
  });

  it("Emits lock event", async () => {
    const DURATION = 1;
    const response = await contract.lock(DURATION);
    expect(response.logs.length).to.equals(1);
    expect(response.logs[0].event).to.equals("Locked");
    const args = response.logs[0].args as Locked["args"];
    expect(args.account).to.equals(accounts[0]);
    expect(args.duration.toNumber()).to.equals(DURATION);
  });

  it("Emits permanent lock event", async () => {
    const response = await contract.permanentLock();
    expect(response.logs.length).to.equals(1);
    expect(response.logs[0].event).to.equals("PermanentlyLocked");
    const args = response.logs[0].args as PermanentlyLocked["args"];
    expect(args.account).to.equals(accounts[0]);
  });
});
