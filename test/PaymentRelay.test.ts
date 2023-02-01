import {
  PaymentRelayInstance,
  TestERC20Instance,
} from "../types/truffle-contracts";

const Token = artifacts.require("TestERC20");
const PaymentRelay = artifacts.require("PaymentRelay");

contract("PaymentRelay", (accounts) => {
  let champContract: TestERC20Instance;
  let paymentRelayContract: PaymentRelayInstance;

  const sender = accounts[1];
  const receiver = accounts[2];
  const anyUser = accounts[5];
  const initialChampBalance = web3.utils.toWei("1000", "ether");

  before(async function () {
    champContract = await Token.new(initialChampBalance, { from: sender });
    paymentRelayContract = await PaymentRelay.new();
    await paymentRelayContract.grantRole(
      await paymentRelayContract.TOKEN_ROLE(),
      champContract.address
    );
    await paymentRelayContract.grantRole(
      await paymentRelayContract.RECEIVER_ROLE(),
      receiver
    );
  });

  describe("As any user", function () {
    it("I cannot interact with PaymentRelay directly", async function () {
      try {
        await paymentRelayContract.execPayment(sender, "100", "0x0", receiver, {
          from: sender,
        });
        assert.fail("tokensReceived() did not throw.");
      } catch (e: any) {
        expect(e.message).to.includes("missing role");
      }
    });
  });

  describe("As any user", function () {
    describe("When token are sent", function () {
      const PAYMENT_UID = web3.utils.keccak256("PAYMENT_UID");
      const amount = "1000";

      before(async function () {
        await champContract.approve(paymentRelayContract.address, amount);
        await paymentRelayContract.execPayment(
          champContract.address,
          amount,
          PAYMENT_UID,
          receiver,
          { from: sender }
        );
      });

      it("Should sent tokens", async function () {
        expect((await champContract.balanceOf(receiver)).toString()).to.equals(
          amount
        );
      });

      it("Should mark payment as sent", async function () {
        expect(
          await paymentRelayContract.isPaymentProcessed(PAYMENT_UID, sender)
        ).to.be.true;
      });

      it("Should block payment duplication", async function () {
        try {
          await champContract.approve(paymentRelayContract.address, amount);
          await paymentRelayContract.execPayment(
            champContract.address,
            amount,
            PAYMENT_UID,
            receiver,
            { from: sender }
          );
          assert.fail("operatorSend() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("already processed");
        }
      });

      it("Should block payment to unauthorized receiver", async function () {
        const ANY_UID = web3.utils.keccak256("ANY_UID");

        try {
          await champContract.approve(paymentRelayContract.address, amount);
          await paymentRelayContract.execPayment(
            champContract.address,
            amount,
            ANY_UID,
            anyUser,
            { from: sender }
          );
          assert.fail("operatorSend() did not throw.");
        } catch (e: any) {
          expect(e.message).to.includes("missing role");
        }
      });

      it("Should keep free other UID", async function () {
        const ANY_UID = web3.utils.keccak256("ANY_UID");
        expect(await paymentRelayContract.isPaymentProcessed(ANY_UID, sender))
          .to.be.false;
      });

      it("Should prevent UID collision between users", async function () {
        expect(
          await paymentRelayContract.isPaymentProcessed(PAYMENT_UID, anyUser)
        ).to.be.false;
      });
    });
  });
});
