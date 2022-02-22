import { VestingWalletMultiLinearInstance } from "../types/truffle-contracts";
import { ScheduleStepAdded } from "../types/truffle-contracts/VestingWalletMultiLinear";

const VestingWalletMultiLinear = artifacts.require("VestingWalletMultiLinear");
const AnyToken = artifacts.require("ERC777PresetFixedSupply");

contract("VestingWalletMultiLinear", (accounts) => {
  const rootUser = accounts[0];

  describe("Access control", () => {
    let contract: VestingWalletMultiLinearInstance;

    beforeEach(async () => {
      contract = await VestingWalletMultiLinear.new(rootUser, 0);
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

    it("Requires SCHEDULE_MANAGER_ROLE to edit schedule", async () => {
      await contract.renounceRole(
        await contract.SCHEDULE_MANAGER_ROLE(),
        rootUser
      );

      try {
        await contract.addToSchedule(0, 0);
        assert.fail("addToSchedule() did not throw.");
      } catch (e) {
        expect((e as Error).message).to.includes("missing role");
      }
      try {
        await contract.resetSchedule();
        assert.fail("resetSchedule() did not throw.");
      } catch (e) {
        expect((e as Error).message).to.includes("missing role");
      }
    });

    it("Requires BENEFICIARY_MANAGER_ROLE to change beneficiary", async () => {
      await contract.renounceRole(
        await contract.BENEFICIARY_MANAGER_ROLE(),
        rootUser
      );

      try {
        await contract.setBeneficiary(accounts[1]);
        assert.fail("setBeneficiary() did not throw.");
      } catch (e) {
        expect((e as Error).message).to.includes("missing role");
      }
    });
  });

  it("Pause token release", async () => {
    const vestingContract = await VestingWalletMultiLinear.new(rootUser, 0);
    await vestingContract.addToSchedule(0, 1);
    await vestingContract.pause();

    try {
      await vestingContract.methods["release()"]();
      assert.fail("release() did not throw.");
    } catch (e) {
      expect((e as Error).message).to.includes("Pausable: paused");
    }
  });

  it("Lock schedule", async () => {
    const vestingContract = await VestingWalletMultiLinear.new(rootUser, 0);
    await vestingContract.addToSchedule(0, 1);
    await vestingContract.pause();
    await vestingContract.unpause();
    await vestingContract.methods["release()"]();
  });

  it("Add step to schedule", async () => {
    const vestingContract = await VestingWalletMultiLinear.new(rootUser, 0);
    await vestingContract.addToSchedule(1, 3);
    await vestingContract.addToSchedule(5, 7);

    expect((await vestingContract.stepPercentSum()).toNumber()).to.equals(6);
    expect((await vestingContract.duration()).toNumber()).to.equals(10);
  });

  it("Emit ScheduleStepAdded event", async () => {
    const vestingContract = await VestingWalletMultiLinear.new(rootUser, 0);
    const transaction = await vestingContract.addToSchedule(1, 3);

    expect(transaction.logs[0]).to.have.property("event", "ScheduleStepAdded");
    const event = transaction
      .logs[0] as Truffle.TransactionLog<ScheduleStepAdded>;
    expect(event.args).to.have.property("stepPercent");
    expect(event.args.stepPercent.toNumber()).to.equals(1);
    expect(event.args).to.have.property("stepDuration");
    expect(event.args.stepDuration.toNumber()).to.equals(3);
  });

  it("Reset schedule", async () => {
    const vestingContract = await VestingWalletMultiLinear.new(rootUser, 0);
    await vestingContract.addToSchedule(0, 1);
    await vestingContract.resetSchedule();

    expect(
      (await vestingContract.stepPercentSum()).toNumber(),
      "stepPercentSum should be reset."
    ).to.equals(0);
    expect(
      (await vestingContract.duration()).toNumber(),
      "duration should be reset."
    ).to.equals(0);

    try {
      await vestingContract.methods["vestedAmount(uint64)"](0);
      assert.fail("vestedAmount() did not throw.");
    } catch (e) {
      expect((e as Error).message).to.includes("Schedule is empty");
    }
  });

  it("Emit ScheduleReset event", async () => {
    const vestingContract = await VestingWalletMultiLinear.new(rootUser, 0);
    await vestingContract.addToSchedule(0, 1);
    const transaction = await vestingContract.resetSchedule();

    expect(transaction.logs[0]).to.have.property("event", "ScheduleReset");
  });

  it("Edit beneficiary", async () => {
    const newBeneficiary = accounts[1];
    const vestingContract = await VestingWalletMultiLinear.new(rootUser, 0);
    expect(await vestingContract.beneficiary()).to.equals(rootUser);
    await vestingContract.setBeneficiary(newBeneficiary);
    expect(await vestingContract.beneficiary()).to.equals(newBeneficiary);
  });

  it("Emit BeneficiaryEdited event", async () => {
    const newBeneficiary = accounts[1];
    const vestingContract = await VestingWalletMultiLinear.new(rootUser, 0);
    const transaction = await vestingContract.setBeneficiary(newBeneficiary);

    expect(transaction.logs[0]).to.have.property("event", "BeneficiaryEdited");
    expect(transaction.logs[0].args).to.have.property(
      "beneficiaryAddress",
      newBeneficiary
    );
  });

  describe("vestedAmount function", () => {
    it("Release 0% before start", async () => {
      const START_DATE = 100;

      const tokenContract = await AnyToken.new(
        "AnyToken",
        "ANY",
        [],
        1000,
        rootUser
      );
      const vestingContract = await VestingWalletMultiLinear.new(rootUser, 100);
      await tokenContract.transfer(vestingContract.address, 100, {
        from: rootUser,
      });
      await vestingContract.addToSchedule(100, 0);

      expect(
        (
          await vestingContract.methods["vestedAmount(address,uint64)"](
            tokenContract.address,
            START_DATE - 1
          )
        ).toNumber()
      ).to.equals(0);
    });

    it("Release 100% after end", async () => {
      const START_DATE = 100;

      const tokenContract = await AnyToken.new(
        "AnyToken",
        "ANY",
        [],
        1000,
        rootUser
      );
      const vestingContract = await VestingWalletMultiLinear.new(rootUser, 100);
      await tokenContract.transfer(vestingContract.address, 100, {
        from: rootUser,
      });
      await vestingContract.addToSchedule(100, 0);

      expect(
        (
          await vestingContract.methods["vestedAmount(address,uint64)"](
            tokenContract.address,
            START_DATE + 1
          )
        ).toNumber()
      ).to.equals(100);
    });

    it("Release linearly in a step", async () => {
      // 1000 token invested (and minted)
      const TOTAL_VESTED = 1000;

      // Initialise
      const tokenContract = await AnyToken.new(
        "AnyToken",
        "ANY",
        [],
        TOTAL_VESTED,
        rootUser
      );
      const vestingContract = await VestingWalletMultiLinear.new(rootUser, 0);
      await tokenContract.transfer(vestingContract.address, TOTAL_VESTED, {
        from: rootUser,
      });

      // 10% after 1 day (10% in 1 day)
      await vestingContract.addToSchedule(10, 24 * 60 * 60);
      // 90% after 11 days (80% in 10 days)
      await vestingContract.addToSchedule(80, 10 * 24 * 60 * 60);
      // 100% after 100 days (10% in 89 day)
      await vestingContract.addToSchedule(10, 89 * 24 * 60 * 60);

      // Should be 10% at the beginning of step 2 (1 days in total)
      expect(
        (
          await vestingContract.methods["vestedAmount(address,uint64)"](
            tokenContract.address,
            24 * 60 * 60
          )
        ).toNumber()
      ).to.equals((TOTAL_VESTED * 10) / 100);
      // Should be 50% on middle of step 2
      expect(
        (
          await vestingContract.methods["vestedAmount(address,uint64)"](
            tokenContract.address,
            6 * 24 * 60 * 60
          )
        ).toNumber()
      ).to.equals((TOTAL_VESTED * 50) / 100);
      // Should be 90% at the end of step 2 (11 days in total)
      expect(
        (
          await vestingContract.methods["vestedAmount(address,uint64)"](
            tokenContract.address,
            11 * 24 * 60 * 60
          )
        ).toNumber()
      ).to.equals((TOTAL_VESTED * 90) / 100);
    });

    it("Release linearly from steps", async () => {
      // 1000 token invested (and minted)
      const TOTAL_VESTED = 1000;

      // Initialise
      const tokenContract = await AnyToken.new(
        "AnyToken",
        "ANY",
        [],
        TOTAL_VESTED,
        rootUser
      );
      const vestingContract = await VestingWalletMultiLinear.new(rootUser, 0);
      await tokenContract.transfer(vestingContract.address, TOTAL_VESTED, {
        from: rootUser,
      });

      // 10% after 1 day (10% in 1 day)
      await vestingContract.addToSchedule(10, 24 * 60 * 60);
      // 90% after 11 days (80% in 10 days)
      await vestingContract.addToSchedule(80, 10 * 24 * 60 * 60);
      // 100% after 100 days (10% in 89 day)
      await vestingContract.addToSchedule(10, 89 * 24 * 60 * 60);

      // Should be 0% at the beginning of step 1 (0 day in total)
      expect(
        (
          await vestingContract.methods["vestedAmount(address,uint64)"](
            tokenContract.address,
            0
          )
        ).toNumber()
      ).to.equals(0);
      // Should be 10% at the beginning of step 2 (1 day in total)
      expect(
        (
          await vestingContract.methods["vestedAmount(address,uint64)"](
            tokenContract.address,
            24 * 60 * 60
          )
        ).toNumber()
      ).to.equals((TOTAL_VESTED * 10) / 100);
      // Should be 90% at the beginning of step 3 (11 days in total)
      expect(
        (
          await vestingContract.methods["vestedAmount(address,uint64)"](
            tokenContract.address,
            11 * 24 * 60 * 60
          )
        ).toNumber()
      ).to.equals((TOTAL_VESTED * 90) / 100);
      // Should be 100% at the end of step 3 (100 days in total)
      expect(
        (
          await vestingContract.methods["vestedAmount(address,uint64)"](
            tokenContract.address,
            100 * 24 * 60 * 60
          )
        ).toNumber()
      ).to.equals(TOTAL_VESTED);
    });
  });
});
